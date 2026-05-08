(function (global) {
  "use strict";

  const TrickalBoard = global.TrickalBoard = global.TrickalBoard || {};

  TrickalBoard.CHARACTERS = [
  {
    "id": "amelia",
    "name": "アメリア",
    "race": "エルフ",
    "type": 3,
    "names": {
      "en": "Amelia",
      "zh-Hant": "艾蜜莉雅"
    }
  },
  {
    "id": "aya",
    "name": "アヤ",
    "race": "魔女",
    "type": 1,
    "names": {
      "en": "Aya",
      "zh-Hant": "綾"
    }
  },
  {
    "id": "alice",
    "name": "アリス",
    "race": "幽霊",
    "type": 4,
    "names": {
      "en": "Alice",
      "zh-Hant": "愛麗絲"
    }
  },
  {
    "id": "allet",
    "name": "アレット",
    "race": "エルフ",
    "type": 5,
    "names": {
      "en": "Allet",
      "zh-Hant": "阿萊特"
    }
  },
  {
    "id": "ed",
    "name": "イード",
    "race": "エルフ",
    "type": 1,
    "names": {
      "en": "Ed",
      "zh-Hant": "伊德"
    }
  },
  {
    "id": "ifrit",
    "name": "イフリート",
    "race": "精霊",
    "type": 3,
    "names": {
      "en": "Ifrit",
      "zh-Hant": "伊弗利特"
    }
  },
  {
    "id": "ui",
    "name": "ウイ",
    "race": "精霊",
    "type": 5,
    "names": {
      "en": "Ui",
      "zh-Hant": "羽伊"
    }
  },
  {
    "id": "vivi",
    "name": "ヴィヴィ",
    "race": "竜族",
    "type": 4,
    "names": {
      "en": "Vivi",
      "zh-Hant": "薇薇"
    }
  },
  {
    "id": "ashur",
    "name": "エシュール",
    "race": "妖精",
    "type": 5,
    "names": {
      "en": "Ashur",
      "zh-Hant": "艾舒爾"
    }
  },
  {
    "id": "espi",
    "name": "エスピー",
    "race": "幽霊",
    "type": 5,
    "names": {
      "en": "Espi",
      "zh-Hant": "艾斯皮"
    }
  },
  {
    "id": "epica",
    "name": "エピカ",
    "race": "獣人",
    "type": 5,
    "names": {
      "en": "Epica",
      "zh-Hant": "艾皮卡"
    }
  },
  {
    "id": "erpin",
    "name": "エルフィン",
    "race": "妖精",
    "type": 1,
    "names": {
      "en": "Erpin",
      "zh-Hant": "艾爾芬"
    }
  },
  {
    "id": "elena",
    "name": "エレナ",
    "race": "エルフ",
    "type": 1,
    "names": {
      "en": "Elena",
      "zh-Hant": "艾琳娜"
    }
  },
  {
    "id": "gabia",
    "name": "ガヴィア",
    "race": "精霊",
    "type": 2,
    "names": {
      "en": "Gabia",
      "zh-Hant": "加薇雅"
    }
  },
  {
    "id": "carren",
    "name": "カレン",
    "race": "妖精",
    "type": 5,
    "names": {
      "en": "Carren",
      "zh-Hant": "卡蓮"
    }
  },
  {
    "id": "canna",
    "name": "カンナ",
    "race": "エルフ",
    "type": 3,
    "names": {
      "en": "Canna",
      "zh-Hant": "康娜"
    }
  },
  {
    "id": "kidian",
    "name": "ギデオン",
    "race": "竜族",
    "type": 3,
    "names": {
      "en": "Kidian",
      "zh-Hant": "基迪恩"
    }
  },
  {
    "id": "kyuri",
    "name": "キュウイ",
    "race": "妖精",
    "type": 2,
    "names": {
      "en": "Kyuri",
      "zh-Hant": "路易"
    }
  },
  {
    "id": "chloe",
    "name": "クロエ",
    "race": "妖精",
    "type": 4,
    "names": {
      "en": "Chloe",
      "zh-Hant": "庫洛艾"
    }
  },
  {
    "id": "kommy",
    "name": "コミー",
    "race": "獣人",
    "type": 3,
    "names": {
      "en": "Kommy",
      "zh-Hant": "柯米"
    }
  },
  {
    "id": "sari",
    "name": "サリー",
    "race": "幽霊",
    "type": 4,
    "names": {
      "en": "Sari",
      "zh-Hant": "莎莉"
    }
  },
  {
    "id": "sylla",
    "name": "シーラ",
    "race": "精霊",
    "type": 2,
    "names": {
      "en": "Sylla",
      "zh-Hant": "希拉"
    }
  },
  {
    "id": "shaydi",
    "name": "シェイディ",
    "race": "幽霊",
    "type": 1,
    "names": {
      "en": "Shaydi",
      "zh-Hant": "謝蒂"
    }
  },
  {
    "id": "jade",
    "name": "ジェイド",
    "race": "竜族",
    "type": 3,
    "names": {
      "en": "Jade",
      "zh-Hant": "傑德"
    }
  },
  {
    "id": "x-xion-x",
    "name": "シオン・ザ・DB",
    "race": "幽霊",
    "type": 3,
    "names": {
      "en": "xXionx",
      "zh-Hant": "錫安"
    }
  },
  {
    "id": "sist",
    "name": "シスト",
    "race": "竜族",
    "type": 5,
    "names": {
      "en": "Sist",
      "zh-Hant": "希瑟圖"
    }
  },
  {
    "id": "shoupan",
    "name": "シュパン",
    "race": "妖精",
    "type": 5,
    "names": {
      "en": "Shoupan",
      "zh-Hant": "修帕"
    }
  },
  {
    "id": "jubee",
    "name": "ジュビー",
    "race": "精霊",
    "type": 1,
    "names": {
      "en": "Jubee",
      "zh-Hant": "茱蜜"
    }
  },
  {
    "id": "silphir",
    "name": "シルフィール",
    "race": "竜族",
    "type": 4,
    "names": {
      "en": "Silphir",
      "zh-Hant": "希菲爾"
    }
  },
  {
    "id": "snorky",
    "name": "スノキー",
    "race": "魔女",
    "type": 1,
    "names": {
      "en": "Snorky",
      "zh-Hant": "斯諾奇"
    }
  },
  {
    "id": "speaki",
    "name": "スピッキー",
    "race": "幽霊",
    "type": 1,
    "names": {
      "en": "Speaki",
      "zh-Hant": "斯皮奇"
    }
  },
  {
    "id": "selene",
    "name": "セリーネ",
    "race": "幽霊",
    "type": 1,
    "names": {
      "en": "Selene",
      "zh-Hant": "瑟琳娜"
    }
  },
  {
    "id": "taida",
    "name": "タイダー",
    "race": "エルフ",
    "type": 2,
    "names": {
      "en": "Taida",
      "zh-Hant": "泰達"
    }
  },
  {
    "id": "chopi",
    "name": "チョッピー",
    "race": "獣人",
    "type": 3,
    "names": {
      "en": "Chopi",
      "zh-Hant": "喬菲"
    }
  },
  {
    "id": "diana",
    "name": "ディアナ",
    "race": "獣人",
    "type": 5,
    "names": {
      "en": "Diana",
      "zh-Hant": "蒂亞娜"
    }
  },
  {
    "id": "naia",
    "name": "ナイア",
    "race": "精霊",
    "type": 4,
    "names": {
      "en": "Naia",
      "zh-Hant": "奈雅"
    }
  },
  {
    "id": "butter",
    "name": "バター",
    "race": "獣人",
    "type": 1,
    "names": {
      "en": "Butter",
      "zh-Hant": "奶油"
    }
  },
  {
    "id": "patula",
    "name": "パトラ",
    "race": "妖精",
    "type": 1,
    "names": {
      "en": "Patula",
      "zh-Hant": "帕特拉"
    }
  },
  {
    "id": "picora",
    "name": "ピコラ",
    "race": "魔女",
    "type": 3,
    "names": {
      "en": "Picora",
      "zh-Hant": "皮可菈"
    }
  },
  {
    "id": "big-wood",
    "name": "ビッグウッド",
    "race": "精霊",
    "type": 2,
    "names": {
      "en": "BigWood",
      "zh-Hant": "大木頭"
    }
  },
  {
    "id": "hilde",
    "name": "ヒルデ",
    "race": "エルフ",
    "type": 2,
    "names": {
      "en": "Hilde",
      "zh-Hant": "希爾德"
    }
  },
  {
    "id": "festa",
    "name": "フェスタ",
    "race": "エルフ",
    "type": 1,
    "names": {
      "en": "Festa",
      "zh-Hant": "佩斯塔"
    }
  },
  {
    "id": "blanchet",
    "name": "ブランセ",
    "race": "精霊",
    "type": 4,
    "names": {
      "en": "Blanchet",
      "zh-Hant": "布蘭切"
    }
  },
  {
    "id": "fricle",
    "name": "フリックル",
    "race": "魔女",
    "type": 2,
    "names": {
      "en": "Fricle",
      "zh-Hant": "芙莉可"
    }
  },
  {
    "id": "haley",
    "name": "ヘイリー",
    "race": "エルフ",
    "type": 3,
    "names": {
      "en": "Haley",
      "zh-Hant": "海莉"
    }
  },
  {
    "id": "beni",
    "name": "ベニー",
    "race": "獣人",
    "type": 4,
    "names": {
      "en": "Beni",
      "zh-Hant": "班尼"
    }
  },
  {
    "id": "belita",
    "name": "ベリータ",
    "race": "魔女",
    "type": 4,
    "names": {
      "en": "Belita",
      "zh-Hant": "貝麗塔"
    }
  },
  {
    "id": "veroo",
    "name": "ベル",
    "race": "幽霊",
    "type": 1,
    "names": {
      "en": "Veroo",
      "zh-Hant": "貝魯"
    }
  },
  {
    "id": "velvet",
    "name": "ベルベット",
    "race": "魔女",
    "type": 5,
    "names": {
      "en": "Velvet",
      "zh-Hant": "佩佩"
    }
  },
  {
    "id": "posher",
    "name": "ポーシャー",
    "race": "魔女",
    "type": 3,
    "names": {
      "en": "Posher",
      "zh-Hant": "珀榭"
    }
  },
  {
    "id": "mago",
    "name": "マーゴ",
    "race": "獣人",
    "type": 2,
    "names": {
      "en": "Mago",
      "zh-Hant": "馬爾"
    }
  },
  {
    "id": "maestro-mk2",
    "name": "マエストロMK2",
    "race": "エルフ",
    "type": 4,
    "names": {
      "en": "MaestroMK2",
      "zh-Hant": "大師2號"
    }
  },
  {
    "id": "mayo",
    "name": "マヨ",
    "race": "妖精",
    "type": 3,
    "names": {
      "en": "Mayo",
      "zh-Hant": "瑪約"
    }
  },
  {
    "id": "marie",
    "name": "マリー",
    "race": "妖精",
    "type": 2,
    "names": {
      "en": "Marie",
      "zh-Hant": "瑪麗"
    }
  },
  {
    "id": "mynx",
    "name": "ミンス",
    "race": "獣人",
    "type": 2,
    "names": {
      "en": "Mynx",
      "zh-Hant": "米雪"
    }
  },
  {
    "id": "maison",
    "name": "メゾン",
    "race": "幽霊",
    "type": 5,
    "names": {
      "en": "Maison",
      "zh-Hant": "梅森"
    }
  },
  {
    "id": "meluna",
    "name": "メロナ",
    "race": "精霊",
    "type": 2,
    "names": {
      "en": "Meluna",
      "zh-Hant": "梅露娜"
    }
  },
  {
    "id": "momo",
    "name": "モモ",
    "race": "獣人",
    "type": 2,
    "names": {
      "en": "Momo",
      "zh-Hant": "桃桃"
    }
  },
  {
    "id": "yumimi",
    "name": "ユミミ",
    "race": "獣人",
    "type": 4,
    "names": {
      "en": "Yumimi",
      "zh-Hant": "劉美美"
    }
  },
  {
    "id": "yomi",
    "name": "ヨミ",
    "race": "？？？",
    "type": 1,
    "names": {
      "en": "Yomi",
      "zh-Hant": "優米"
    }
  },
  {
    "id": "leets",
    "name": "リッツ",
    "race": "竜族",
    "type": 2,
    "names": {
      "en": "Leets",
      "zh-Hant": "莉茲"
    }
  },
  {
    "id": "rim",
    "name": "リム",
    "race": "幽霊",
    "type": 5,
    "names": {
      "en": "Rim",
      "zh-Hant": "琳"
    }
  },
  {
    "id": "rudd",
    "name": "ルード",
    "race": "竜族",
    "type": 4,
    "names": {
      "en": "Rudd",
      "zh-Hant": "路德"
    }
  },
  {
    "id": "rufo",
    "name": "ルポ",
    "race": "獣人",
    "type": 5,
    "names": {
      "en": "Rufo",
      "zh-Hant": "盧波"
    }
  },
  {
    "id": "layze",
    "name": "レイジー",
    "race": "エルフ",
    "type": 3,
    "names": {
      "en": "Layze",
      "zh-Hant": "雷吉"
    }
  },
  {
    "id": "levi",
    "name": "レヴィ",
    "race": "魔女",
    "type": 5,
    "names": {
      "en": "Levi",
      "zh-Hant": "萊薇"
    }
  },
  {
    "id": "rohne",
    "name": "ローネ",
    "race": "エルフ",
    "type": 4,
    "names": {
      "en": "Rohne",
      "zh-Hant": "洛涅"
    }
  },
  {
    "id": "kyarot",
    "name": "キャロット",
    "race": "妖精",
    "type": 2,
    "names": {
      "en": "Kyarot",
      "zh-Hant": "卡洛特"
    }
  }
];
})(window);
