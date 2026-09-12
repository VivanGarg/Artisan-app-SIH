"""
Multilingual Auto-Cataloger for KalaSetu (SIH26090, expected-solution feature 2).

An artisan speaks a sentence or two about their piece, in Hindi or a mix of
Hindi and English ("hathkargha resham ki saree, zari border, Chanderi ka"). The
speech-to-text layer in the app hands us that raw transcript. This module turns
it into a marketplace listing: an English title, a structured description,
bullet points, SEO keywords, and the attributes it actually recognised.

Design note on translation
--------------------------
This is a **craft-domain glossary**, not a general-purpose neural translator.
That is a deliberate trade-off, not a shortcut:

  * The vocabulary here is small, closed, and highly specific - roughly 200
    terms covering weaves, fibres, techniques, GI clusters and colours. A
    general NMT model routinely mangles exactly these words ("dokra" and
    "bandhani" are not in its training distribution) while costing hundreds of
    megabytes and a GPU.
  * It runs offline in microseconds, which is the whole point for rural users.
  * Every mapping is inspectable and correctable by a domain expert, so a
    weaver who says the app got their craft's name wrong can have it fixed.

What it does NOT do: translate free-flowing prose. Words outside the glossary
are passed through untouched, and `unrecognised_terms` reports them so the
lexicon can be grown from real usage.
"""
from __future__ import annotations

import os
import re

import joblib

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(HERE, "..", "models")

# --------------------------------------------------------------------------
# Craft domain lexicon.  Devanagari + common romanisations -> canonical English.
# Grouped by attribute type so the composer knows how to use each match.
# --------------------------------------------------------------------------

PRODUCTS = {
    "साड़ी": "saree", "साडी": "saree", "saree": "saree", "sari": "saree",
    "दुपट्टा": "dupatta", "dupatta": "dupatta", "odhni": "dupatta",
    "कुर्ता": "kurta", "kurta": "kurta", "kurti": "kurti",
    "शॉल": "shawl", "shawl": "shawl", "stole": "stole",
    "चादर": "bedsheet", "bedsheet": "bedsheet", "bedcover": "bedsheet",
    "दरी": "rug", "durrie": "rug", "dhurrie": "rug", "carpet": "carpet", "rug": "rug",
    "मटका": "pot", "matka": "pot", "pot": "pot", "vase": "vase",
    "मूर्ति": "idol", "murti": "idol", "idol": "idol", "statue": "sculpture",
    "गहना": "jewellery", "jewellery": "jewellery", "jewelry": "jewellery",
    "चूड़ी": "bangles", "chudi": "bangles", "bangle": "bangles", "bangles": "bangles",
    "टोकरी": "basket", "tokri": "basket", "basket": "basket",
    "लहंगा": "lehenga", "lehenga": "lehenga", "lehanga": "lehenga",
    "चुन्नी": "chunni", "scarf": "scarf", "towel": "towel", "napkin": "napkin",
    "bag": "bag", "झोला": "bag", "jhola": "bag", "cushion": "cushion cover",
}

MATERIALS = {
    "रेशम": "silk", "resham": "silk", "silk": "silk", "mulberry": "mulberry silk",
    "tussar": "tussar silk", "tasar": "tussar silk", "eri": "eri silk", "muga": "muga silk",
    "सूती": "cotton", "कपास": "cotton", "suti": "cotton", "cotton": "cotton", "khadi": "khadi",
    "खादी": "khadi", "ऊन": "wool", "oon": "wool", "wool": "wool", "woollen": "wool",
    "pashmina": "pashmina", "पश्मीना": "pashmina", "jute": "jute", "जूट": "jute",
    "linen": "linen", "chiffon": "chiffon", "georgette": "georgette", "crepe": "crepe",
    "पीतल": "brass", "pital": "brass", "brass": "brass",
    "कांसा": "bell metal", "kansa": "bell metal", "bell metal": "bell metal",
    "तांबा": "copper", "tamba": "copper", "copper": "copper", "silver": "silver", "चांदी": "silver",
    "मिट्टी": "terracotta", "mitti": "terracotta", "terracotta": "terracotta", "clay": "terracotta",
    "बांस": "bamboo", "baans": "bamboo", "bamboo": "bamboo", "cane": "cane",
    "चमड़ा": "leather", "chamda": "leather", "leather": "leather",
    "लकड़ी": "wood", "lakdi": "wood", "wood": "wood", "wooden": "wood", "sandalwood": "sandalwood",
    "marble": "marble", "संगमरमर": "marble", "stone": "stone", "पत्थर": "stone",
}

TECHNIQUES = {
    "हथकरघा": "handwoven", "hathkargha": "handwoven", "handloom": "handloom",
    "handwoven": "handwoven", "हाथ": "handmade", "handmade": "handmade", "haath": "handmade",
    "ज़री": "zari", "जरी": "zari", "zari": "zari", "zardozi": "zardozi",
    "कढ़ाई": "embroidery", "kadhai": "embroidery", "embroidery": "embroidery",
    "embroidered": "embroidery", "छपाई": "block print", "chhapai": "block print",
    "block print": "block print", "blockprint": "block print", "printed": "block print",
    "बांधनी": "bandhani", "bandhani": "bandhani", "bandhej": "bandhani", "tie dye": "bandhani",
    "ikat": "ikat", "इकत": "ikat", "patola": "patola", "पटोला": "patola",
    "kalamkari": "kalamkari", "कलमकारी": "kalamkari",
    "chikankari": "chikankari", "चिकनकारी": "chikankari",
    "phulkari": "phulkari", "फुलकारी": "phulkari",
    "dokra": "dhokra", "ढोकरा": "dhokra", "dhokra": "dhokra",
    "warli": "warli", "वारली": "warli", "madhubani": "madhubani", "मधुबनी": "madhubani",
    "pattachitra": "pattachitra", "gond": "gond art", "pichwai": "pichwai",
    "meenakari": "meenakari", "मीनाकारी": "meenakari", "filigree": "filigree",
    "batik": "batik", "applique": "applique", "mirror work": "mirror work",
    "बुनाई": "weaving", "bunai": "weaving", "weave": "weave", "woven": "woven",
    "natural dye": "natural dye", "vegetable dye": "natural dye", "रंगाई": "dyeing",
}

REGIONS = {
    "चंदेरी": "Chanderi", "chanderi": "Chanderi",
    "बनारसी": "Banarasi", "banarasi": "Banarasi", "benarasi": "Banarasi", "varanasi": "Banarasi",
    "kanjeevaram": "Kanjeevaram", "kanchipuram": "Kanjeevaram", "कांजीवरम": "Kanjeevaram",
    "pochampally": "Pochampally", "bhagalpur": "Bhagalpuri", "भागलपुर": "Bhagalpuri",
    "maheshwari": "Maheshwari", "महेश्वरी": "Maheshwari", "paithani": "Paithani",
    "जामदानी": "Jamdani", "jamdani": "Jamdani", "baluchari": "Baluchari",
    "kutch": "Kutch", "कच्छ": "Kutch", "jaipur": "Jaipur", "जयपुर": "Jaipur",
    "kashmir": "Kashmir", "कश्मीर": "Kashmir", "bastar": "Bastar", "बस्तर": "Bastar",
    "mysore": "Mysore", "मैसूर": "Mysore", "sambalpuri": "Sambalpuri",
    "bagru": "Bagru", "sanganer": "Sanganeri", "ajrakh": "Ajrakh",
    "moradabad": "Moradabad", "मुरादाबाद": "Moradabad", "channapatna": "Channapatna",
    "bidri": "Bidri", "बिदरी": "Bidri", "thanjavur": "Thanjavur", "kullu": "Kullu",
}

COLOURS = {
    "लाल": "red", "laal": "red", "red": "red", "नीला": "blue", "neela": "blue", "blue": "blue",
    "हरा": "green", "hara": "green", "green": "green", "पीला": "yellow", "peela": "yellow",
    "yellow": "yellow", "काला": "black", "kala": "black", "black": "black",
    "सफेद": "white", "safed": "white", "white": "white", "ivory": "ivory",
    "सुनहरा": "golden", "sunehra": "golden", "golden": "golden", "gold": "golden",
    "गुलाबी": "pink", "gulabi": "pink", "pink": "pink", "maroon": "maroon", "मैरून": "maroon",
    "orange": "orange", "नारंगी": "orange", "purple": "purple", "बैंगनी": "purple",
    "indigo": "indigo", "नील": "indigo", "beige": "beige", "cream": "cream", "grey": "grey",
}

# Ordered so longer, more specific phrases match before their substrings.
_LEXICONS = [
    ("technique", TECHNIQUES),
    ("region", REGIONS),
    ("material", MATERIALS),
    ("product", PRODUCTS),
    ("colour", COLOURS),
]

_STOPWORDS = {
    "है", "हैं", "का", "की", "के", "और", "में", "ये", "यह", "मेरा", "मेरी", "बना", "बनाया",
    "ka", "ki", "ke", "hai", "aur", "mein", "ye", "mera", "meri", "banaya", "se", "wala",
    "a", "an", "the", "is", "are", "and", "with", "of", "in", "this", "it", "my", "for",
    "made", "from", "very", "good", "nice", "have", "has", "i",
}


def _normalise(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\sऀ-ॿ]+", " ", text)   # keep Devanagari block
    return re.sub(r"\s+", " ", text)


def extract_attributes(transcript: str) -> dict:
    """Match the transcript against the craft lexicon, longest phrase first."""
    text = _normalise(transcript)
    found = {kind: [] for kind, _ in _LEXICONS}
    consumed = set()

    for kind, lexicon in _LEXICONS:
        # Longest keys first so "bell metal" wins over "metal", "block print"
        # over "print".
        for term in sorted(lexicon, key=len, reverse=True):
            if not re.search(r"(?<!\w)" + re.escape(term) + r"(?!\w)", text):
                continue
            canonical = lexicon[term]
            if canonical in found[kind]:
                continue
            span = re.search(r"(?<!\w)" + re.escape(term) + r"(?!\w)", text).span()
            if any(i in consumed for i in range(*span)):
                continue
            consumed.update(range(*span))
            found[kind].append(canonical)

    matched_tokens = {t for t in text.split() if any(
        re.search(r"(?<!\w)" + re.escape(t) + r"(?!\w)", k) or t == k
        for _, lex in _LEXICONS for k in lex
    )}
    unrecognised = [
        t for t in text.split()
        if t not in matched_tokens and t not in _STOPWORDS and len(t) > 2 and not t.isdigit()
    ]

    found["unrecognised_terms"] = unrecognised[:12]
    return found


class Cataloger:
    """Turns a spoken transcript into a listing. Loads the category model once."""

    def __init__(self):
        path = os.path.join(MODEL_DIR, "category_classifier.joblib")
        self.classifier = joblib.load(path) if os.path.exists(path) else None

    # -- category -----------------------------------------------------------

    def predict_category(self, text: str, top_k: int = 3):
        """
        Infer the marketplace category so the artisan never picks from a list
        of 152 English labels. Returns [] if the model has not been trained.
        """
        if self.classifier is None or not text.strip():
            return []
        proba = self.classifier.predict_proba([text])[0]
        classes = self.classifier.classes_
        order = proba.argsort()[::-1][:top_k]
        return [
            {"category": str(classes[i]), "confidence": round(float(proba[i]), 4)}
            for i in order
        ]

    # -- composition --------------------------------------------------------

    @staticmethod
    def _title(attrs: dict) -> str:
        technique = attrs["technique"][0].title() if attrs["technique"] else ""
        material = attrs["material"][0].title() if attrs["material"] else ""
        product = attrs["product"][0].title() if attrs["product"] else "Handcrafted Piece"
        region = attrs["region"][0] if attrs["region"] else ""

        parts = [p for p in (technique, material, product) if p]
        title = " ".join(dict.fromkeys(parts))       # dedupe, keep order
        if region:
            title += f" - {region}"
        return title

    @staticmethod
    def _description(attrs: dict, title: str) -> str:
        material = attrs["material"][0] if attrs["material"] else None
        product = attrs["product"][0] if attrs["product"] else "piece"
        region = attrs["region"][0] if attrs["region"] else None
        techniques = attrs["technique"]
        colours = attrs["colour"]

        lead = f"A {product}"
        if material:
            lead += f" crafted in {material}"
        if region:
            lead += f", made in the {region} cluster"
        lead += "."

        craft = ""
        if techniques:
            listed = techniques[0] if len(techniques) == 1 else (
                ", ".join(techniques[:-1]) + " and " + techniques[-1]
            )
            craft = f" Finished using {listed}, worked entirely by hand."

        colour = ""
        if colours:
            colour = f" Presented in {' and '.join(colours[:2])}."

        close = (" Made by a verified artisan and sold direct, so the maker "
                 "receives the greater share of what you pay.")

        return (lead + craft + colour + close).strip()

    @staticmethod
    def _bullets(attrs: dict) -> list:
        bullets = []
        if attrs["material"]:
            bullets.append(f"Material: {', '.join(attrs['material'])}")
        if attrs["technique"]:
            bullets.append(f"Craft technique: {', '.join(attrs['technique'])}")
        if attrs["region"]:
            bullets.append(f"Origin cluster: {', '.join(attrs['region'])}")
        if attrs["colour"]:
            bullets.append(f"Colour: {', '.join(attrs['colour'])}")
        bullets.append("Handmade - slight variation is a mark of authenticity, not a defect")
        return bullets

    @staticmethod
    def _keywords(attrs: dict, category: str | None) -> list:
        words = []
        for kind in ("product", "material", "technique", "region", "colour"):
            words.extend(attrs[kind])
        if category:
            words.append(category.lower())
        words.extend(["handmade", "artisan made", "authentic indian craft"])
        if attrs["region"]:
            words.append(f"{attrs['region'][0].lower()} handicraft")
        # dedupe, preserve order
        return list(dict.fromkeys(w.lower() for w in words))[:15]

    # -- public API ---------------------------------------------------------

    def catalog(self, transcript: str, category: str | None = None) -> dict:
        """
        Full pipeline: transcript -> attributes -> category -> listing copy.

        `category`, if supplied by the artisan, wins over the predicted one -
        the person who made the object is a better authority than the model.
        """
        attrs = extract_attributes(transcript)

        # Feed the classifier the canonical English terms as well as the raw
        # text; the training corpus is English, so a Hindi-only transcript
        # would otherwise give it nothing to work with.
        canonical = " ".join(
            attrs["product"] + attrs["material"] + attrs["technique"] + attrs["colour"]
        )
        predictions = self.predict_category(f"{transcript} {canonical}".strip())

        chosen = category or (predictions[0]["category"] if predictions else None)
        title = self._title(attrs)

        return {
            "title": title,
            "description": self._description(attrs, title),
            "bullets": self._bullets(attrs),
            "keywords": self._keywords(attrs, chosen),
            "attributes": {k: v for k, v in attrs.items() if k != "unrecognised_terms"},
            "category": chosen,
            "category_predictions": predictions,
            "category_source": "artisan" if category else "predicted",
            "unrecognised_terms": attrs["unrecognised_terms"],
            "transcript": transcript,
        }
