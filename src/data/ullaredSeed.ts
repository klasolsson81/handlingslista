export type SeedCategory = {
  name: string;
  items: string[];
};

export type Seed = {
  categories: SeedCategory[];
  uncategorized: string[];
};

export const ullaredSeed: Seed = {
  categories: [
    {
      name: "HUSHÅLL",
      items: [
        "tvättmedel vit och färg",
        "shower gel",
        "head and shoulder schampoo 1L",
        "bindor",
        "tandkräm",
        "såpa",
        "WC toilet cleaner",
        "diskmedel",
        "fryspåsar zipper olika storlekar",
        "hushållspapper",
        "svartpåse",
        "handtvål",
      ],
    },
    {
      name: "KÖKET",
      items: [
        "stekpanna/wokpanna",
        "skärbräda",
        "bestick set",
        "bowl",
        "glass pitcher",
      ],
    },
    {
      name: "Alex kläder",
      items: [
        "T shirt",
        "Shorts",
        "strumpor",
        "boxer",
        "jeans",
        "keps",
        "sommarjacka",
        "slipper",
        "sandaler",
      ],
    },
    {
      name: "Mamma kläder",
      items: [
        "linneklänning blå jeans",
        "match set",
        "make up",
        "badkläder",
        "natt byxa",
        "t shirt",
        "cykling short på jobbet",
        "hair color",
        "loafer shoes",
      ],
    },
    {
      name: "Pappa kläder",
      items: ["Jeans 42 x34", "T-shirt 5XL", "Skjorta"],
    },
    {
      name: "HEMMET",
      items: [
        "ljusstake",
        "överkast",
        "lång örngott",
        "tvättlappar vita/beige ansikte",
        "små handdukar grön/beige",
        "matta 170x240",
        "tavla*",
        "blommor balkong",
        "neckmassage",
      ],
    },
    {
      name: "MIMMI",
      items: ["kattmat sås", "dry food", "vatten fountain", "sand"],
    },
  ],
  uncategorized: ["Hårvax DiFi", "Loreal Ansiktstvätt"],
};
