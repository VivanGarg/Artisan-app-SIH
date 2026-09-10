const seedArtisans = [
  {
    id: "art-1",
    name: "Smt. Yashoda Bai",
    title: "5th Generation Master Weaver",
    cluster: "Pranpur, Chanderi",
    state: "Madhya Pradesh",
    giCraft: "Chanderi Silk & Cotton Weaving",
    giCode: "GI-2005-07",
    pehchanId: "MP-CH-2018-912",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmBcao9SQ6fS3CSz-27fe53PhDEG-HJ63roi-xoyknxGoAzHzn-F9hf25P9s4p5EkY1DE77iKPAX4FYER6EFXfs6qsBqD7rntKd448zOBaw1M37RuI6cW8KuEuJhMD1U-HFkfb2jWOPtckMLBaRH8-NXMfgqjaWhVBOABTjMtH0OxgSYGjGxwiljSDYZwP2ydBcoMlzANhOuQAFDvpX4dQwakmCR_qwXbKhtZOuuWI29qkI36_jAKA",
    bio: "Weaving gossamer fine katan silks on traditional pit looms passed down through five generations in Pranpur village. Specializes in hand-picked peacock butis using pure silver zari.",
    experienceYears: 34,
    guildMembers: 28,
    fairWagePercentage: 88
  },
  {
    id: "art-2",
    name: "Shri Budhram Kashyap",
    title: "National Awardee Dokra Sculptor",
    cluster: "Bastar Tribal Cluster",
    state: "Chhattisgarh",
    giCraft: "Bastar Iron & Bell Metal Craft",
    giCode: "GI-2008-83",
    pehchanId: "CG-BS-2015-441",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Preserving the 4,000-year-old lost-wax casting technique (cire-perdue). Uses riverbed clay and natural beeswax to forge sacred folk icons and totems.",
    experienceYears: 42,
    guildMembers: 19,
    fairWagePercentage: 82
  },
  {
    id: "art-3",
    name: "Ustad Bashir Ahmed",
    title: "Master Sozni Embroiderer",
    cluster: "Srinagar Heritage Cluster",
    state: "Jammu & Kashmir",
    giCraft: "Kashmir Pashmina & Sozni Needlework",
    giCode: "GI-2008-46",
    pehchanId: "JK-SR-2012-108",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Spins and needles grade-A Changthangi mountain goat fleece into exquisite Pashmina heirloom stoles, with intricate micro-stitching taking up to 90 days per piece.",
    experienceYears: 38,
    guildMembers: 15,
    fairWagePercentage: 85
  },
  {
    id: "art-4",
    name: "Gopal Saini",
    title: "Shilp Guru Pottery Artisan",
    cluster: "Kot Jewar, Jaipur",
    state: "Rajasthan",
    giCraft: "Jaipur Blue Pottery",
    giCode: "GI-2006-25",
    pehchanId: "RJ-JP-2017-732",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Crafts low-fired Egyptian paste pottery using quartz stone, multani mitti, and natural cobalt oxide dyes, free from any clay or throwing wheels.",
    experienceYears: 29,
    guildMembers: 22,
    fairWagePercentage: 80
  }
];

const seedProducts = [
  {
    id: "prod-1",
    title: "Handwoven Chanderi Katan Silk Saree",
    hindiTitle: "हथकरघा चंदेरी कातन सिल्क साड़ी",
    category: "Handloom Weaves",
    price: 7850,
    originalPrice: 11500,
    artisanId: "art-1",
    artisanName: "Smt. Yashoda Bai",
    artisanLineage: "5th Gen Pit-Loom Weaver, Chanderi, MP",
    cluster: "Chanderi",
    state: "Madhya Pradesh",
    giCertified: true,
    giCode: "GI-2005-07",
    silkMarkCode: "SMOI-CH-88301",
    pehchanVerified: true,
    dispatchTime: "48 Hours",
    artisanWage: 6900,
    fairWagePercentage: 88,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBPY7EbJCXidlF6lx6HV-VpQZBfi3UrBiCVxciTPfXYuJxHS1LsdC4DuK2fm6Auj-JUZcP-BiTArfk75pt78-THQNztLr5JS143pOdVGS8g1W4dj8QmfdqpdS-l-TO4C1bMndQlw0sepSGxP8NNogQxD1MQH5fWHewBJwIKC-5pjhj6xZpVMYrhwtA--eiCRCMMrYuivANNGYzuns1N7HZhzHkYiK1GfddD3fZKML2mcZk6-Cak1eX",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8ONCxTJxBRMkmphOMiktLWfsSMkAG8tCqh5Aytt7-g8eeU-LeScbM430LldXdHmvCmShKbTuvNBr2DruOt9XTzUbx7LmLMPDWUzGfqZDMWbMCfT0S9fkJ1Ti8AA-C4WfCLK7Uf9FuQh-jyAJpWZlfUNXwKt-qIUJZjWwXJMpnoGJloexZX3WB68z0J7_KC6qJMuL8hcOEfMnS0cWJe5aKuLkwZAYKyUhMKMxO72R_wc0Y4QjY53MG",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByXNY7gy2BufSb5ypYawH3sVYtrSoz8Rj6QuoLg4rYns6YrtXpOdM8_aQ5R_sMh0CkyfVn6JtiU3KeRt4jkoynoLpdkmhhKRblS1S-gSF7KzqN-5ej8ZE-UsWdSKzxCelTeg_okUNJ8cqTaCTtjWApxx--YVP7xOfPdSBYjDcYa9sdACqRezJ0HucRCxHKGRal0wZnch3-B8WsCykmW1YidEVRBHhtot6iRR87kmJDcJ75AIoVjGuC",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6UeUGmd2fI7wli88UEQn4medsbelSBkiz2EhFFSgT9UJgUTBehmGzw6_KbHf4PvdOFs6RbWLOQzuvy1RFiAKl0NNEMCpb4wt8mXjZhyGaA_Zy8qwOR6fg8guShupS1EccjMWbx6xYYYWoQlEG5IcH84tIxSetFiSspcKIy4K_-jo2Y-iZphh2ihxzsoxhsC8Ut1nm32Bt8rQ3Sgl4-JevTdwfisWOyO2ssHz5fV_iO1K4tXoU3Rzt"
    ],
    description: "Crafted on a traditional pit-loom using unbleached raw katan silk warp (20/22 denier) and hand-reeled cotton-silk weft at 96 ends per inch. Hand-picked peacock butis are laid using electro-plated pure silver zari with zero machine float threads.",
    specs: {
      warp: "20/22 D Katan Silk",
      weft: "Hand-reeled Cotton-Silk",
      zari: "Pure Tested Silver Zari",
      loom: "Pranpur Pit-Loom",
      weaveDuration: "14 Days",
      length: "6.3 Meters (with blouse piece)"
    },
    audioStory: {
      title: "Weaver Story (Hindi/Bundelkhandi)",
      duration: "0:42 min",
      speaker: "Smt. Yashoda Bai"
    },
    reviews: [
      {
        id: "rev-1",
        author: "Ananya K.",
        location: "Bengaluru",
        rating: 5,
        badge: "Verified Patron via ONDC",
        comment: "The sheer gossamer weight makes it drape like a feather. Knowing ₹6,900 went directly to Yashoda Bai made opening the parcel deeply meaningful. A genuine heirloom."
      },
      {
        id: "rev-2",
        author: "Dr. Radhika Sen",
        location: "Kolkata",
        rating: 5,
        badge: "Verified Patron via ONDC",
        comment: "The GI certificate and weaver registration QR tag scanned seamlessly on arrival. Real silver zari without any scratchiness or stiffness. Flawless craftsmanship."
      }
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 48
  },
  {
    id: "prod-2",
    title: "Dokra Bell Metal Sacred Nandi",
    hindiTitle: "डोकरा घंटी धातु पवित्र नंदी",
    category: "Dokra Metalcraft",
    price: 2890,
    originalPrice: 4200,
    artisanId: "art-2",
    artisanName: "Shri Budhram Kashyap",
    artisanLineage: "Tribal Artisan, Bastar, Chhattisgarh",
    cluster: "Kondagaon, Bastar",
    state: "Chhattisgarh",
    giCertified: true,
    giCode: "GI-2008-83",
    pehchanVerified: true,
    dispatchTime: "24 Hours",
    artisanWage: 2350,
    fairWagePercentage: 81.3,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPWcYRuuACjAdse5B084ZirHZxsHD5G2cGLV4atMFpoGFpZEfvDtZ_PPDb4vOw69xJJZ4y225dk08VfDbHP_-9RW12trE7XFQB87H_SoZ1MTlXroIV6RmOTYoILfVvBkQQJNI50VvArAz0rdvY7DxwFwFVViSH1Dn-URtU9J9UIoNuWVj_sV0LKIZXGuwi8BxedbFnUbqJF2zCnt3uGNKh1aoETZoxAXjiuWUCaOIJSQxNqlpwWaer",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Each Dokra sculpture is an unrepeatable monolithic bronze casting created with the lost-wax technique. Coils of pure beeswax are wound over a clay core, hand-molded with rhythmic tribal motifs, and kiln-fired in pit ovens.",
    specs: {
      material: "Bell Metal & Brass Bronze",
      technique: "Cire-Perdue (Lost Wax)",
      weight: "1.45 kg",
      dimensions: "7.5 x 5.2 x 4.8 inches",
      craftDuration: "7 Days"
    },
    audioStory: {
      title: "Story of Bastar Bell Metal",
      duration: "0:35 min",
      speaker: "Shri Budhram Kashyap"
    },
    reviews: [
      {
        id: "rev-3",
        author: "Devendra S.",
        location: "Pune",
        rating: 5,
        badge: "Verified Patron via ONDC",
        comment: "Remarkable weight and patina. You can see the hand-wound wax coil detailing upon close inspection. Authentic tribal art."
      }
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 32
  },
  {
    id: "prod-3",
    title: "Jaipur Blue Pottery Floral Urn",
    hindiTitle: "जयपुर ब्लू पॉटरी फ्लोरल कलश",
    category: "Pottery & Clay",
    price: 3450,
    originalPrice: 4800,
    artisanId: "art-4",
    artisanName: "Gopal Saini",
    artisanLineage: "Shilp Guru Pottery Master, Kot Jewar",
    cluster: "Jaipur",
    state: "Rajasthan",
    giCertified: true,
    giCode: "GI-2006-25",
    pehchanVerified: true,
    dispatchTime: "48 Hours",
    artisanWage: 2750,
    fairWagePercentage: 79.7,
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Crafted without clay using powdered quartz, raw glass, katira gond, and multani mitti. Hand-painted with natural cobalt oxide and copper oxide pigments before firing in wood kilns.",
    specs: {
      material: "Quartz & Egyptian Paste",
      glaze: "Lead-free Borax & Natural Minerals",
      height: "11 Inches",
      finish: "Turquoise & Cobalt Glaze",
      craftDuration: "10 Days"
    },
    reviews: [],
    inStock: true,
    rating: 4.9,
    reviewCount: 19
  },
  {
    id: "prod-4",
    title: "Kashmiri Hand-Embroidered Pashmina Stole",
    hindiTitle: "कश्मीरी हाथ की कढ़ाई पश्मीना स्टोल",
    category: "Handloom Weaves",
    price: 14200,
    originalPrice: 19500,
    artisanId: "art-3",
    artisanName: "Ustad Bashir Ahmed",
    artisanLineage: "Master Sozni Embroiderer, Srinagar",
    cluster: "Srinagar",
    state: "Jammu & Kashmir",
    giCertified: true,
    giCode: "GI-2008-46",
    pehchanVerified: true,
    dispatchTime: "72 Hours",
    artisanWage: 12200,
    fairWagePercentage: 85.9,
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Hand-spun 100% pure mountain Changthangi goat Pashmina, spun on traditional Charkha and embellished with micro Sozni needlework featuring timeless paisley and chinar leaf motifs.",
    specs: {
      fiber: "100% Cashmere Goat Down (14 microns)",
      embroidery: "Fine Needle Sozni",
      dimensions: "200 cm x 70 cm",
      craftDuration: "45 Days"
    },
    reviews: [],
    inStock: true,
    rating: 5.0,
    reviewCount: 14
  },
  {
    id: "prod-5",
    title: "Kutch Ajrakh Hand Block Print Cotton Saree",
    hindiTitle: "कच्छ अजरख प्राकृतिक रंग ब्लॉक प्रिंट साड़ी",
    category: "Handloom Weaves",
    price: 4950,
    originalPrice: 6800,
    artisanId: "art-1",
    artisanName: "Dr. Ismail Khatri Cluster",
    artisanLineage: "10th Gen Ajrakh Block Artisans, Dhamadka",
    cluster: "Ajrakhpur, Kutch",
    state: "Gujarat",
    giCertified: true,
    giCode: "GI-2011-140",
    pehchanVerified: true,
    dispatchTime: "48 Hours",
    artisanWage: 4100,
    fairWagePercentage: 82.8,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Traditional 16-stage resist dyeing process utilizing natural indigo, madder root, harda, and iron scrap ferment. Pressed with intricately carved teakwood blocks.",
    specs: {
      fabric: "Organic Handspun Chanderi Cotton",
      dyes: "100% Plant & Mineral Derived",
      blockCarving: "Seasoned Teakwood",
      craftDuration: "21 Days"
    },
    reviews: [],
    inStock: true,
    rating: 4.8,
    reviewCount: 27
  },
  {
    id: "prod-6",
    title: "Bastar Tribal Dokra Bull Figurine",
    hindiTitle: "बस्तर आदिवासी डोकरा बैल मूर्ति",
    category: "Dokra Metalcraft",
    price: 1850,
    originalPrice: 2600,
    artisanId: "art-2",
    artisanName: "Shri Budhram Kashyap",
    artisanLineage: "Tribal Guild, Bastar",
    cluster: "Bastar",
    state: "Chhattisgarh",
    giCertified: true,
    giCode: "GI-2008-83",
    pehchanVerified: true,
    dispatchTime: "24 Hours",
    artisanWage: 1500,
    fairWagePercentage: 81.0,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPWcYRuuACjAdse5B084ZirHZxsHD5G2cGLV4atMFpoGFpZEfvDtZ_PPDb4vOw69xJJZ4y225dk08VfDbHP_-9RW12trE7XFQB87H_SoZ1MTlXroIV6RmOTYoILfVvBkQQJNI50VvArAz0rdvY7DxwFwFVViSH1Dn-URtU9J9UIoNuWVj_sV0LKIZXGuwi8BxedbFnUbqJF2zCnt3uGNKh1aoETZoxAXjiuWUCaOIJSQxNqlpwWaer"
    ],
    description: "Compact handcrafted Dokra totem celebrating agrarian rural harmony. Created using non-ferrous bell metal casting with distinct coil texture.",
    specs: {
      material: "Recycled Brass & Bell Metal",
      weight: "0.85 kg",
      dimensions: "5.5 x 4.0 x 3.2 inches"
    },
    reviews: [],
    inStock: true,
    rating: 4.7,
    reviewCount: 16
  }
];

module.exports = { seedArtisans, seedProducts };
