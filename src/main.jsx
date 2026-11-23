import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleHelp, House, Images, MapPin, Menu as MenuIcon, TrainFront, X } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import L from "leaflet";
import SakuraEditorialPoster from "./sakura-editorial-poster.jsx";
import AccordionGallery from "./AccordionGallery.jsx";
import FlowerLoader from "./FlowerLoader.jsx";
import ScrollGallery from "./components/ui/scroll-gallery.jsx";
import OptimizedImage from "./components/OptimizedImage.jsx";
import { AnimatedTabs } from "./components/ui/animated-tabs.jsx";
import { CoverflowCarousel } from "./components/ui/coverflow-carousel.jsx";
import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
} from "./components/ui/progressive-carousel.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "leaflet/dist/leaflet.css";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const JapaneseContext = createContext(false);
const japaneseCopy = {
  TOKYO: "とうきょう",
  HOME: "ほーむ",
  "THINGS TO DO": "とうきょうですること",
  "FIND YOUR WAY": "まちをめぐる",
  TRAIN: "でんしゃ",
  GALLERY: "しゃしん",
  FAQ: "よくあるしつもん",
  "REACH OUT": "おといあわせ",
  SETTINGS: "せってい",
  PLAY: "さいせい",
  "OPEN PLAYER": "ぷれいやーをひらく",
  CLOSE: "とじる",
  "Open menu": "めにゅーをひらく",
  "Close menu": "めにゅーをとじる",
  English: "えいご",
  Japanese: "日本語",
  "Use Japanese across the site": "サイト全体の表示を日本語に切り替えます",
  "Switch the site's visible copy to standard Japanese using kanji, katakana, and hiragana.": "サイト内の文章を、漢字・カタカナ・ひらがなを使った自然な日本語に切り替えます。",
  "Japanese is on": "日本語表示中",
  "Interface language": "表示言語",
  "Tokyo neighborhoods": "とうきょうのまち",
  "Street life": "まちのにぎわい",
  "Late trains": "よるのでんしゃ",
  "A City of Many Sides | いろんなまちが、ひとつに。": "さまざまな表情を見せる街、東京。",
  "From the first train to the last glow of neon, Tokyo changes block by block. Take a crossing, a quiet garden, a narrow lane. The best route is the one that lets you wander.": "はつでんからねおんがきえるころまで、とうきょうはまちかどごとにかおをかえます。こうさてんをわたり、しずかなにわやほそいろじをあるく。よりみちできるみちが、いちばんのるーとです。",
  "Find your own pace in Tokyo.": "とうきょうで、じぶんのぺーすをみつけよう。",
  "TOKYO, JAPAN": "にほん、とうきょう",
  "SHIBUYA / LIVE CAMERA": "しぶや / らいぶかめら",
  "Live camera at Shibuya Crossing, Tokyo": "とうきょう、しぶやすくらんぶるこうさてんのらいぶかめら",
  "Live view of Shibuya Crossing": "しぶやすくらんぶるこうさてんのらいぶ",
  "CITY GUIDE / 01": "まちあるき / 01",
  "35°39′N / 139°42′E": "35°39′N / 139°42′E",
  "Soft bokeh cherry blossoms background": "とうきょうのさくらのけしき",
  "Cherry blossom branch in the foreground": "とうきょうのさくらのえだ",
};

const places = [
  {
    number: "01",
    name: "Shibuya",
    jp: "渋谷",
    tag: "ENERGY",
    area: "SHIBUYA, TOKYO",
    hours: "OPEN LATE",
    description: "Neon, movement, music and the constant rhythm of Tokyo after dark.",
    image: "https://images.pexels.com/photos/31001134/pexels-photo-31001134.jpeg?cs=srgb&fm=jpg",
  },
  {
    number: "02",
    name: "Asakusa",
    jp: "浅草",
    tag: "TRADITION",
    area: "TAITO, TOKYO",
    hours: "DAY → NIGHT",
    description: "Ancient streets, lanterns and the atmosphere of old Tokyo around Senso-ji.",
    image: "https://images.pexels.com/photos/14703207/pexels-photo-14703207.jpeg?cs=srgb&fm=jpg",
  },
  {
    number: "03",
    name: "Meiji Jingu",
    jp: "明治神宮",
    tag: "QUIET",
    area: "SHIBUYA, TOKYO",
    hours: "SUNRISE → SUNSET",
    description: "A forest sanctuary hidden inside one of the world's busiest cities.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Meiji_Jingu_Shrine._Saki_Barrels._%2827915377617%29.jpg",
  },
  {
    number: "04",
    name: "Daikanyama",
    jp: "代官山",
    tag: "DESIGN",
    area: "SHIBUYA, TOKYO",
    hours: "DAY → NIGHT",
    description: "Quiet streets, independent stores, architecture and Tokyo's creative side.",
    image: "https://images.pexels.com/photos/29241321/pexels-photo-29241321.jpeg?cs=srgb&fm=jpg",
  },
  {
    number: "05",
    name: "Tokyo Skytree",
    jp: "東京スカイツリー",
    tag: "HEIGHT",
    area: "SUMIDA, TOKYO",
    hours: "DAY → NIGHT",
    description: "A vertical view of Tokyo stretching far beyond the city center.",
    image: "https://images.pexels.com/photos/12536680/pexels-photo-12536680.jpeg?cs=srgb&fm=jpg",
  },
  {
    number: "06",
    name: "Tokyo Tower",
    jp: "東京タワー",
    tag: "LANDMARK",
    area: "MINATO, TOKYO",
    hours: "DAY → NIGHT",
    description: "Tokyo Tower stands above Shiba Park, with sweeping views over the city.",
    image: "https://wallpapers.com/images/featured/tokyo-tower-uzzgjgcdymbrjui7.jpg",
    mapQuery: "Tokyo Tower, Minato City, Tokyo, Japan",
  },
  {
    number: "07",
    name: "Kamakura",
    jp: "鎌倉",
    tag: "COASTAL ESCAPE",
    area: "KANAGAWA, JAPAN",
    hours: "About 1 hr from Tokyo",
    description: "A seaside town known for its Great Buddha, temples and relaxed coastal streets.",
    image: "https://images.unsplash.com/photo-1706516510664-a8d1e7577eeb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FtYWt1cmElMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    mapQuery: "Kamakura, Kanagawa, Japan",
  },
  {
    number: "08",
    name: "Kawaguchiko",
    jp: "河口湖",
    tag: "MT. FUJI VIEWS",
    area: "YAMANASHI, JAPAN",
    hours: "About 2 hr from Tokyo",
    description: "A lakeside escape with clear views of Mount Fuji and a scenic local railway.",
    image: "https://images.pexels.com/photos/21759296/pexels-photo-21759296.jpeg?cs=srgb&dl=pexels-andrey-grushnikov-223358-21759296.jpg&fm=jpg",
    mapQuery: "Lake Kawaguchi, Yamanashi, Japan",
  },
];

const extendedJapaneseCopy = {
  "CHECK LIVE ROUTE IN GOOGLE MAPS ↗": "ぐーぐるまっぷでろせんをみる ↗",
  "SUICA / PASMO": "すいか / ぱすも",
  CONTACTLESS: "たっちけっさい",
  CASH: "げんきん",
  "DAY PASSES": "いちにちじょうしゃけん",
  "TOEI BUS": "とえいばす",
  "General adult fare in Tokyo's 23 wards. Some special services differ.": "とうきょう23くのいっぱんてきなおとなうんちんです。とくべつなばすはことなります。",
  "Unlimited rides on Tokyo Metro for 24 hours from first use.": "はじめてつかってから24じかん、とうきょうめとろがのりほうだいです。",
  "Current adult IC fares vary by distance. Paper tickets use a separate fare table.": "おとなのICうんちんはきょりによってかわります。きっぷはべつのうんちんひょうをごらんください。",
  "Tap in and out on participating trains and buses. Rechargeable and widely useful.": "たいおうするでんしゃやばすで、のるときとおりるときにたっちします。ちゃーじしてひろくつかえます。",
  "Supported contactless cards work on participating Tokyo Metro services and locations.": "たいおうするとうきょうめとろのろせんやばしょでは、たっちけっさいがつかえます。",
  "Keep some yen for smaller shops, buses or backup situations.": "ちいさなおみせやばすにそなえて、げんきんもよういしましょう。",
  "Choose a pass only when your planned rides make the fixed price worthwhile.": "よていしているのりもののかずにあわせて、おとくなきっぷをえらびましょう。",
  "Eat your way through Tokyo": "とうきょうをたべあるく",
  "Ramen, sushi counters, konbini runs and late-night bites. Tokyo rewards following the smell down the side street.": "らーめん、すし、こんびに、よるおそくのごはん。よいにおいのするよこみちにはいってみましょう。",
  "Walk through Meiji Jingu": "めいじじんぐうをあるく",
  "Leave the noise behind and walk beneath the enormous torii gates and forest canopy.": "にぎわいをはなれて、おおきなとりいともりのなかをあるきましょう。",
  "Explore Daikanyama": "だいかんやまをめぐる",
  "Independent fashion, design stores, coffee and some of Tokyo's most relaxed streets.": "こせいてきなふくやざっか、こーひー。とうきょうでもとくにおだやかなまちです。",
  "See Shibuya after dark": "よるのしぶやをあるく",
  "Cross the scramble, follow the neon and discover the streets beyond the famous intersection.": "こうさてんをわたり、ねおんをたどって、そのさきのみちをみつけましょう。",
  "Slow down in Tokyo": "とうきょうでひとやすみ",
  "Yoyogi Park and the green spaces around Meiji create a completely different rhythm from the city center.": "よよぎこうえんとめいじじんぐうのもりには、まちなかとはちがうじかんがながれています。",
  "See Tokyo from above": "とうきょうをたかいところから",
  "Look across the skyline from Tokyo Skytree and watch the city change with the light.": "とうきょうすかいつりーから、ひかりとともにかわるまちをながめましょう。",
  "See Tokyo Tower at twilight": "ゆうぐれのとうきょうたわー",
  "Watch Minato shift from daylight to neon around one of Tokyo's most recognizable towers.": "とうきょうをだいひょうするたわーのまわりで、みなとのまちがねおんにかわっていきます。",
  "OPENING HOURS": "えいぎょうじかん",
  "PLAN AROUND": "じかんをみて",
  "BUY WHAT": "ほしいものを",
  "YOU CAME FOR.": "さがそう。",
  "DRAG TO EXPLORE": "すらいどしてみる",
  "WHAT ELSE TO BUY": "ほかにかいたいもの",
  "SEE LOCATION": "ばしょをみる",
  "JAPANESE BRANDS": "にほんのぶらんど",
  SNEAKERS: "すにーかー",
  VINTAGE: "びんてーじ",
  SKINCARE: "すきんけあ",
  STATIONERY: "ぶんぼうぐ",
  SNACKS: "おかし",
  TECH: "でんきせいひん",
  KITCHENWARE: "きっちんようひん",
  "TRAVEL ESSENTIALS": "たびのひつじひん",
  "TOKYO / VISUAL ARCHIVE": "とうきょう / しゃしん",
  "08 PLACES": "08のばしょ",
  "Tokyo Tower": "とうきょうたわー",
  Kamakura: "かまくら",
  Kawaguchiko: "かわぐちこ",
  LANDMARK: "めいしょ",
  "COASTAL ESCAPE": "うみべのまち",
  "MT. FUJI VIEWS": "ふじさんのけしき",
  "MINATO, TOKYO": "とうきょう、みなと",
  "KANAGAWA, JAPAN": "にほん、かながわ",
  "YAMANASHI, JAPAN": "にほん、やまなし",
  "About 1 hr from Tokyo": "とうきょうからやく1じかん",
  "About 2 hr from Tokyo": "とうきょうからやく2じかん",
  "Tokyo Tower stands above Shiba Park, with sweeping views over the city.": "しばこうえんのそばにたつとうきょうたわーから、まちをみわたせます。",
  "A seaside town known for its Great Buddha, temples and relaxed coastal streets.": "だいぶつやおてら、のんびりしたうみべのまちでしられています。",
  "A lakeside escape with clear views of Mount Fuji and a scenic local railway.": "ふじさんのけしきとろーかるせんがたのしめる、みずうみのまちです。",
  "Twelve scenes, from Shibuya after dark to Kamakura's coast and Mount Fuji.": "よるのしぶやから、かまくらのうみべ、ふじさんまで。12のけしき。",
  "KAMAKURA COAST": "かまくらのうみべ",
  "FUJI / LAKE KAWAGUCHI": "ふじさん / かわぐちこ",
  "Kamakura, Kanagawa": "かながわ、かまくら",
  "Lake Kawaguchi, Yamanashi": "やまなし、かわぐちこ",
  "SELECT A FRAME": "しゃしんをえらぶ",
  IMAGES: "まい",
  "OPEN / VIEW": "ひらく / みる",
  "SHIBUYA AFTER DARK": "よるのしぶや",
  "SENSO-JI AT NIGHT": "よるのせんそうじ",
  "MEIJI JINGU / SAKE BARRELS": "めいじじんぐう / さかだる",
  "DAIKANYAMA / T-SITE": "だいかんやま / てぃーさいと",
  "TOKYO TOWER": "とうきょうたわー",
  "SHINJUKU NIGHTS": "よるのしんじゅく",
  "TOKYO BY TRAIN": "でんしゃでめぐるとうきょう",
  "A TASTE OF TOKYO": "とうきょうのあじ",
  "CITY, THEN GREEN": "まちなかからみどりへ",
  "GOOD TO": "しっておきたい",
  "KNOW.": "こと。",
  "Before you disappear into the city.": "まちへでかけるまえに。",
  "What is the best time to visit Tokyo?": "とうきょうへいくおすすめのきせつは？",
  "Tokyo changes throughout the year. Spring and autumn are popular for comfortable weather and seasonal scenery, while summer and winter offer a different atmosphere.": "とうきょうはきせつごとにかわります。はるとあきはすごしやすく、けしきもたのしめます。なつとふゆにはまたちがうみりょくがあります。",
  "How do I get around Tokyo?": "とうきょうではどうやっていどうしますか？",
  "Tokyo's train and subway network makes most major neighborhoods accessible without a car. Walking is also one of the best ways to experience individual neighborhoods.": "でんしゃやちかてつで、くるまがなくてもおおくのまちへいけます。あるいてまちをたのしむのもおすすめです。",
  "Which areas are featured?": "どのまちをしょうかいしていますか？",
  "This project focuses on Shibuya, Asakusa, Meiji Jingu, Daikanyama and Tokyo Skytree.": "しぶや、あさくさ、めいじじんぐう、だいかんやま、とうきょうすかいつりーをしょうかいしています。",
  "Is Tokyo expensive?": "とうきょうのりょこうひはたかいですか？",
  "Tokyo has options across a wide range of budgets. Food, accommodation and activities can all be approached economically with some planning.": "とうきょうにはさまざまなよさんにあわせたたのしみかたがあります。たべもの、やど、たいけんはけいかくしだいでおさえられます。",
  "What should I know before visiting?": "いくまえにしっておくことはありますか？",
  "Research transportation, opening hours and reservation requirements for places you specifically want to visit. Carrying some cash can also be useful.": "いきたいばしょのこうつう、えいぎょうじかん、よやくのひつようをしらべましょう。げんきんもあるとべんりです。",
  "Have a question, idea or just want to say hello?": "しつもんやあいであがあれば、おきがるにごれんらくください。",
  "01 / NAME": "01 / なまえ",
  "02 / EMAIL": "02 / めーる",
  "03 / MESSAGE": "03 / めっせーじ",
  "Your name": "おなまえ",
  "you@email.com": "めーるあどれす",
  "Write something...": "めっせーじをどうぞ...",
  "SEND MESSAGE": "めーるをおくる",
  CONTACT: "れんらくさき",
  INSTAGRAM: "いんすたぐらむ",
  FACEBOOK: "ふぇいすぶっく",
  GITHUB: "ぎっとはぶ",
  "FROM": "しゅっぱつ",
  "TO": "とうちゃく",
  "TIME": "じかん",
  "ROUTE": "ろせん",
  "PRICE.": "りょうきん。",
  "GET AROUND": "まちをめぐる",
  "TOKYO.": "とうきょう。",
  "Find your own way through Tokyo.": "じぶんだけのとうきょうをみつけましょう。",
  "JR East fares vary by distance and area. Exact journey fares should be checked for the stations you use.": "じぇいあーるのうんちんはきょりとくいきでかわります。りようするえきのうんちんをかくにんしてください。",
  "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.": "とうきょうめとろのICうんちんは¥178から¥324、きっぷはきょりにより¥180から¥330です。",
  "Toei Subway uses distance-based fares; the Tokyo Subway Ticket also covers this line.": "とえいちかてつのうんちんはきょりでかわります。とうきょうちかてつきっぷもつかえます。",
  "Toei Subway; useful for Roppongi, Shinjuku, Ueno-okachimachi and Ryogoku. Use the official fare planner for an exact station-to-station fare.": "とえいちかてつのろせんです。ろっぽんぎ、しんじゅく、うえのおかちまち、りょうごくにべんりです。せいかくなうんちんはこうしきさいとでかくにんしてください。",
  "SHIBUYA, TOKYO": "とうきょう、しぶや",
  "TAITO, TOKYO": "とうきょう、たいとう",
  "SUMIDA, TOKYO": "とうきょう、すみだ",
  "SHIBUYA": "しぶや",
  "ASAKUSA": "あさくさ",
  "HARAJUKU": "はらじゅく",
  "DAIKANYAMA": "だいかんやま",
  "AKIHABARA": "あきはばら",
  GINZA: "ぎんざ",
  "SNEAKERS / STREETWEAR / VINTAGE": "すにーかー / すとりーとうぇあ / びんてーじ",
  "FASHION / STREETWEAR / LIFESTYLE": "ふぁっしょん / すとりーとうぇあ / くらし",
  "JAPANESE BRANDS / DESIGN / VINTAGE": "にほんのぶらんど / でざいん / びんてーじ",
  "CRAFTS / SOUVENIRS / KITCHEN": "こうげいひん / おみやげ / きっちん",
  "ELECTRONICS / CAMERAS / TECH": "でんきせいひん / かめら / てくのろじー",
  "FLAGSHIPS / DEPARTMENT STORES / LUXURY": "ふらっぐしっぷ / ひゃっかてん / こうきゅうひん",
  "Start around Jingumae, Takeshita Street and Cat Street. This is the easiest cluster for sneaker hunting, streetwear and vintage.": "じんぐうまえ、たけしたどおり、きゃっとすとりーとからめぐりましょう。すにーかー、すとりーとうぇあ、ふるぎのおみせがあつまっています。",
  "Shibuya has large commercial complexes plus independent stores. Shibuya PARCO, Jinnan and the streets toward Aoyama are useful for fashion and lifestyle shopping.": "しぶやにはおおきなしょっぴんぐびるとこせいてきなおみせがあります。しぶやぱるこ、じんなん、あおやまほうめんでふぁっしょんやざっかをさがせます。",
  "Quieter than Shibuya, with independent boutiques and Japanese labels around Daikanyama and Sarugakucho.": "しぶやよりもしずかで、だいかんやまやさるがくちょうにはこせいてきなおみせやにほんのぶらんどがあります。",
  "Nakamise and the surrounding streets are good for traditional goods. Kappabashi nearby is especially useful for kitchenware.": "なかみせどおりではでんとうてきなおみやげをさがせます。ちかくのかっぱばしはきっちんようひんでゆうめいです。",
  "A practical stop for electronics, cameras, accessories and stationery. Large retailers cluster around the station.": "でんきせいひん、かめら、あくせさりー、ぶんぼうぐをさがすのにべんりです。えきのちかくにおおきなおみせがあります。",
  "Best for major department stores, flagships and higher-end Japanese and international brands.": "おおきなひゃっかてん、ふらっぐしっぷ、こうきゅうなにほんやかいがいのぶらんどがそろいます。",
  "Sneaker-focused store in Jingumae.": "じんぐうまえにあるすにーかーのおみせ。",
  "Sneaker specialist in Jingumae.": "じんぐうまえにあるすにーかーせんもんてん。",
  "Sneakers and streetwear in Harajuku.": "はらじゅくのすにーかーとすとりーとうぇあ。",
  "Large multi-floor shopping destination in Shibuya.": "しぶやにあるおおきなかいものすぽっと。",
  "Japanese fashion and lifestyle selection.": "にほんのふぁっしょんとくらしのどうぐ。",
  "Vintage clothing in Jingumae.": "じんぐうまえのふるぎや。",
  "Vintage clothing around Jingumae.": "じんぐうまえちかくのふるぎや。",
  "Japanese clothing store in Sarugakucho.": "さるがくちょうにあるにほんのふくのおみせ。",
  "Tokyo's shopping districts have different personalities. Harajuku is strong for street fashion and sneakers, Shibuya for fashion and lifestyle, Daikanyama for quieter Japanese design, Asakusa for traditional goods and kitchenware, Akihabara for electronics, and Ginza for flagships and department stores.": "とうきょうのかいものまちはそれぞれちがうかおをもっています。はらじゅくはすとりーとふぁっしょん、しぶやはふぁっしょん、だいかんやまはでざいん、あさくさはでんとうこうげい、あきはばらはでんきせいひん、ぎんざはひゃっかてんがみどころです。",
  "DRAG / SWIPE →": "すらいど / すわいぷ →",
  "Japan's tax-free shopping system changes on November 1, 2026. Under the new system, eligible visitors pay consumption tax at purchase and receive the refund after passing customs on departure. Bring your original passport and follow the retailer's instructions.": "にほんのめんぜいせいどは2026ねん11がつ1にちにかわります。たいしょうのりょこうしゃはこうにゅうじにしょうひぜいをしはらい、しゅっこくじのぜいかんでへんきんをうけます。ぱすぽーとをもち、おみせのあんないにしたがってください。",
  "The rules and eligibility can change. Check the official Tokyo Tourism / Japan Tourism Agency guidance close to your trip.": "せいどやたいしょうしゃはかわることがあります。りょこうまえにこうしきじょうほうをかくにんしてください。",
  "Opening hours vary by location, season and day. Always check the official venue before visiting. Last admission can also be earlier than closing time.": "えいぎょうじかんはばしょ、きせつ、ようびによってかわります。でかけるまえにこうしきじょうほうをかくにんしてください。さいしゅうにゅうじょうはへいてんよりはやいことがあります。",
  "15–20 min walk": "あるいて15から20ぷん",
  "2–4 min": "2から4ぷん",
  "31 min": "31ぷん",
  "33 min": "33ぷん",
  "~35–40 min": "35から40ぷんほど",
  "~40–45 min": "40から45ぷんほど",
  "~3–8 min": "3から8ぷんほど",
  "~15–20 min": "15から20ぷんほど",
  "~40–50 min": "40から50ぷんほど",
  "~35–45 min": "35から45ぷんほど",
  "Same station": "おなじえき",
  "Choose two different stations for a route estimate.": "ろせんをみるには、べつべつのえきをえらんでください。",
  "Use live route planner": "さいしんのろせんをしらべる",
  "This pair is not hard-coded because routes, operators and transfers can vary. Open Google Maps for the current result.": "ろせんやのりかえはかわることがあるため、このくみあわせはけいさんしていません。ぐーぐるまっぷでさいしんじょうほうをみてください。",
  "Tokyo Metro Ginza Line · direct": "とうきょうめとろ ぎんざせん · のりかえなし",
  "Walk via Harajuku / Meiji-dori": "はらじゅく / めいじどおりをあるく",
  "Tokyu Toyoko Line · 1 stop": "とうきゅうとうよこせん · 1えき",
  "Tokyo Metro Hanzomon Line · direct to Oshiage": "とうきょうめとろ はんぞうもんせん · おしあげまでちょくつう",
  "Ginza Line to Omote-sando + walk": "ぎんざせんでおもてさんどうへ + とほ",
  "Ginza Line to Shibuya + Toyoko Line": "ぎんざせんでしぶやへ + とうよこせん",
  "Toei Asakusa Line · direct": "とえいあさくさせん · ちょくつう",
  "Walk to Shibuya + Toyoko Line": "しぶやまであるく + とうよこせん",
  "Walk to Omote-sando + Metro via Hanzomon": "おもてさんどうまであるく + はんぞうもんせん",
  "Toyoko Line to Shibuya + Hanzomon Line": "とうよこせんでしぶやへ + はんぞうもんせん",
  "THE": "その",
  "GALLERY.": "しゃしん。",
  "TO DO.": "してみよう。",
  "12 FRAMES / TOKYO + DAY TRIPS": "12まい / とうきょう と にちがえり",
  "TOKYO / PLACE GUIDE": "とうきょう / ばしょ",
  NOVEMBER: "11がつ",
  "MATTERS.": "かわります。",
  "MEIJI JINGU": "めいじじんぐう",
  SHINJUKU: "しんじゅく",
  MINATO: "みなと",
  SUMIDA: "すみだ",
  YOYOGI: "よよぎ",
  "YOYOGI / SHIBUYA": "よよぎ / しぶや",
  "TOKYO RAIL NETWORK": "とうきょうのでんしゃ",
  "TOKYO RAILWAY MAP": "とうきょうのろせんず",
  "TOKYO / JAPAN": "とうきょう / にほん",
  "TOKYO / QUESTIONS": "とうきょう / しつもん",
  "VARIES": "ばしょによる",
  "OPEN DAILY": "まいにち",
  "OPEN LATE": "よるおそくまで",
  "DAY → NIGHT": "ひるからよる",
  "SUNRISE → SUNSET": "あさからゆうがた",
  "FASHION / LIFESTYLE": "ふぁっしょん / くらし",
  "JAPANESE FASHION": "にほんのふぁっしょん",
  "TOKYO SKYTREE": "とうきょうすかいつりー",
  "Minato": "みなと",
  "Shinjuku": "しんじゅく",
  "Tokyo rail network": "とうきょうのでんしゃ",
  "Yoyogi / Shibuya": "よよぎ / しぶや",
  "Current adult IC fare published by Tokyo Metro for Shibuya → Asakusa. Paper ticket is ¥260.": "しぶやからあさくさまでのおとなのICうんちんです。かみのきっぷは¥260です。",
  "The shrine is walkable from Shibuya; no train fare is required for this route.": "じんじゃはしぶやからあるいていけます。このるーとはでんしゃのうんちんがかかりません。",
  "Current published one-stop fare between Shibuya and Daikanyama is ¥140 IC.": "しぶやからだいかんやままで、ひとえきのICうんちんは¥140です。",
  "Use Oshiage <SKYTREE> for Tokyo Skytree. Tokyo Metro lists ¥252 IC on the Shibuya–Oshiage section.": "とうきょうすかいつりーへはおしあげえきをつかいます。しぶやからおしあげまでのICうんちんは¥252です。",
  "The estimate uses a walk from the shrine area to Shibuya, then the published ¥140 Shibuya–Daikanyama fare.": "じんじゃからしぶやまであるき、しぶやからだいかんやままでのICうんちん¥140をつかっためやすです。",
  "Estimate based on Metro segments; use the live planner for the exact station entrance and service at your departure time.": "めとろのくかんをもとにしためやすです。しゅっぱつじこくのさいしんじょうほうをかくにんしてください。",
  "Calculated from ¥140 Daikanyama–Shibuya plus ¥252 Shibuya–Oshiage IC fares.": "だいかんやまからしぶやまでの¥140と、しぶやからおしあげまでの¥252をあわせたきんがくです。",
  "atmos Harajuku": "あともす はらじゅく",
  "KICKS LAB. Harajuku": "きっくすらぼ はらじゅく",
  "SNKRDUNK HARAJUKU": "すにーだんく はらじゅく",
  "Shibuya Parco": "しぶやぱるこ",
  "BEAMS JAPAN SHIBUYA": "びーむすじゃぱん しぶや",
  "NUIR VINTAGE HARAJUKU": "ぬいーるびんてーじ はらじゅく",
  "QOO": "くー",
  "Okura": "おおくら",
  "Tokyo": "とうきょう",
  "JR East, Tokyo Metro, Toei Subway and private railways operate separate networks. The map below is a tourist-focused visual guide, not a live timetable.": "じぇいあーる、とうきょうめとろ、とえいちかてつ、みんえいてつどうはそれぞれべつのろせんです。このちずはりょこうしゃむけのあんないで、じこくひょうではありません。",
};

const japaneseUiOverrides = {
  "01 / LANGUAGE": "01 / 言語",
  "A visual journey through the neighborhoods, streets, temples, food and quiet corners that make Tokyo impossible to experience in just one way.": "街並みや路地、寺社、食、静かな場所を巡り、多彩な東京を体験する旅。",
  "ALL LINES": "全路線",
  AREA: "エリア",
  "Adult fares vary by route. Check the fare for your exact stations before travel.": "大人運賃は路線によって異なります。乗車前に利用する駅間の運賃をご確認ください。",
  "BEST TIME": "おすすめの時間帯",
  BEYOND: "その先へ",
  "Change live camera": "ライブカメラを切り替える",
  "Choose a map marker": "地図上のマーカーを選択",
  "Close day trip details": "日帰り旅行の詳細を閉じる",
  "Close food details": "料理の詳細を閉じる",
  "Close photo viewer": "写真を閉じる",
  "Close railway map": "鉄道路線図を閉じる",
  "Close store list": "店舗一覧を閉じる",
  "Crossings, quiet paths, late trains and the neighborhoods in between.": "交差点、静かな小道、夜の電車。その間に広がる街。",
  "DAY TRIPS": "日帰り旅行",
  "Different sides.": "さまざまな表情。",
  "EXPLORE TOKYO": "東京を巡る",
  "FAQ topics": "よくある質問のトピック",
  "FIND YOUR": "自分だけの",
  "FIVE PLACES / ONE CITY": "5つの場所 / ひとつの街",
  FOLLOW: "路線をたどる",
  FOOD: "食",
  "FOOD TO TRY": "食べてみたい料理",
  FOODS: "料理",
  "FROM HERE.": "ここから",
  "Find on map": "地図で探す",
  "Flat adult fare for most Toei bus services in central Tokyo.": "東京都心部の都営バスは、多くの路線で大人運賃が均一です。",
  "Follow the steam, the charcoal and the small signs glowing after dark.": "湯気や炭火、夜に灯る小さな看板をたどってみましょう。",
  "GO.": "出発。",
  "GOOD SPOTS IN TOKYO": "東京のおすすめスポット",
  "Hiragana is on": "日本語表示中",
  "IC FARE ESTIMATE": "IC運賃の目安",
  "IN TOKYO.": "東京で。",
  "It is thousands of them.": "無数の街が集まっています。",
  "JAPAN / TOKYO": "日本 / 東京",
  "JR EAST": "JR東日本",
  KNOW: "知っておきたい",
  "KNOW THE": "知っておきたい",
  "LET'S": "さあ、",
  "LIVE MAP / TOKYO": "東京ライブマップ",
  "METRO 24H": "東京メトロ24時間券",
  MORE: "その他",
  "Main navigation": "メインナビゲーション",
  "Mapbox could not load. Check that your VITE_MAPBOX_TOKEN is valid.": "地図を読み込めませんでした。VITE_MAPBOX_TOKENの設定をご確認ください。",
  "Metro fares shown are adult IC fares; paper ticket prices differ.": "表示運賃は大人用IC運賃です。紙のきっぷとは金額が異なります。",
  "More from Tokyo": "東京のその他の情報",
  "More navigation": "その他のメニュー",
  "Next destinations": "次の行き先",
  "Next live camera": "次のライブカメラ",
  "Next photo": "次の写真",
  "OPEN FULL MAP ↗": "路線図を大きく表示 ↗",
  "OPEN IN MAP": "地図で開く",
  "One city.": "ひとつの街。",
  "Open Tokyo railway map": "東京の鉄道路線図を開く",
  "Open the Tokyo soundtrack player": "東京の音楽プレーヤーを開く",
  "Open wanna feel tokyo? music player": "音楽プレーヤーを開く",
  "PLACES TO GO": "行きたい場所",
  "Places to explore": "おすすめの場所",
  "Places to go in Tokyo": "東京のおすすめスポット",
  "Previous destinations": "前の行き先",
  "Previous live camera": "前のライブカメラ",
  "Previous photo": "前の写真",
  "REFERENCE / RAIL NETWORK": "参考 / 鉄道路線網",
  "SAMPLE ITINERARY": "モデルコース",
  "SETTINGS / LANGUAGE": "設定 / 言語",
  SHOPPING: "ショッピング",
  "STORES IN": "店舗一覧 / ",
  "Scenes from Tokyo, Japan": "東京の風景",
  "Select a numbered marker to see what is nearby.": "番号付きのマーカーを選ぶと、周辺情報が表示されます。",
  "Six city stops, from the bright crossing to a quiet shrine forest.": "にぎやかな交差点から静かな神社の森まで、東京の6つのスポット。",
  "Six easy escapes when Tokyo calls for a different pace.": "東京から少し足を延ばして、いつもと違う時間を楽しむ6つの旅。",
  "Switch the site's visible copy to Japanese written in Hiragana.": "サイト内の文章を、漢字・カタカナ・ひらがなを使った自然な日本語に切り替えます。",
  "TALK.": "話す。",
  "TAP.": "タッチ。",
  "THE CITY.": "この街。",
  "THE GALLERY": "ギャラリー",
  "THE LINES.": "路線を。",
  "TO THERE.": "あちらへ。",
  "TO TRY.": "食べてみよう。",
  "TOKYO / BEYOND THE CITY": "東京 / その先へ",
  "TOKYO / CONNECTION": "東京 / アクセス",
  "TOKYO / DAY TRIPS": "東京 / 日帰り旅行",
  "TOKYO / EXPERIENCES": "東京 / 体験",
  "TOKYO / FOOD": "東京 / 食",
  "TOKYO / IN MOTION": "東京 / 動き続ける街",
  "TOKYO / NAVIGATION": "東京 / ナビゲーション",
  "TOKYO / SOUNDTRACK": "東京 / サウンドトラック",
  "TOKYO / TRANSPORT": "東京 / 交通",
  "TOKYO METRO": "東京メトロ",
  "TOKYO TRAIN GUIDE": "東京の鉄道ガイド",
  "TRAIN GUIDE": "鉄道ガイド",
  "TRAVEL GUIDES": "旅行ガイド",
  "The rail network makes Tokyo easy to explore. Use the railway map for the big picture, then find these places on the live city map.": "鉄道路線網を使えば東京をスムーズに巡れます。路線図で全体を確認し、ライブマップで目的地を探しましょう。",
  "Tokyo day trips": "東京発の日帰り旅行",
  "Tokyo fare options": "東京の運賃",
  "Tokyo is not one city.": "東京はひとつの街ではありません。",
  "Tokyo photography": "東京の写真",
  "Tokyo railway and metro network": "東京の鉄道・地下鉄路線網",
  "Tokyo railway and metro network map": "東京の鉄道・地下鉄路線図",
  "Tokyo railway map": "東京の鉄道路線図",
  "Train lines, fares, passes and the simplest way to move around Tokyo.": "東京の路線、運賃、乗車券と、便利な移動方法を紹介します。",
  "Travel guides": "旅行ガイド",
  "Use Hiragana across the site": "サイト全体の表示を日本語に切り替えます",
  "Valid on Tokyo Metro only; Toei Subway and JR are not included.": "東京メトロのみで利用できます。都営地下鉄とJRは対象外です。",
  "WAY.": "道を。",
  "WHERE TO GO": "行き先",
  "photo viewer": "写真ビューアー",
  "tokyo?": "東京？",
  "wanna feel": "感じてみない？",
  "© 2026 TOKYO — BEYOND THE CITY": "© 2026 東京 — その先へ",
  "Shibuya Crossing": "渋谷スクランブル交差点",
  NIGHT: "夜",
  CULTURE: "文化",
  CITY: "都市",
  DESIGN: "デザイン",
  RAIL: "鉄道",
  NATURE: "自然",
  "Tokyo Tower": "東京タワー",
  "Tokyo Skytree": "東京スカイツリー",
  "Meiji Jingu": "明治神宮",
  "Harajuku": "原宿",
  "Shinjuku": "新宿",
  "Shibuya": "渋谷",
  "Asakusa": "浅草",
  "Ikebukuro": "池袋",
  "Ueno": "上野",
  "Akihabara": "秋葉原",
  "Shinagawa": "品川",
  "Ginza": "銀座",
  "Roppongi": "六本木",
  "Shimbashi": "新橋",
  "Maihama": "舞浜",
  "AIRPORT ACCESS": "空港アクセス",
  "BEFORE YOU BOARD": "乗車前に",
  "Browse the major Tokyo-area operators. Station lists below are key tourist stops and corridors, not every stop on each service.": "東京エリアの主要な鉄道事業者を紹介します。駅名は旅行者向けの主要駅で、各路線の全駅ではありません。",
  "Check the operator's official website or airport station counter for tickets, boarding location, current fares and service.": "きっぷ、乗り場、最新の運賃や運行情報は、鉄道会社の公式サイトまたは空港駅の窓口でご確認ください。",
  "Choose two different stations to plan a trip.": "出発駅と到着駅には異なる駅を選んでください。",
  "Choose two stations to open a live transit planner. This site does not provide live schedules, fares, platform assignments, or disruptions.": "2つの駅を選ぶと、最新の経路検索を開けます。このサイトでは運行時刻、運賃、番線、運休情報を提供していません。",
  "Directory reference only; detailed route geometry is not included on this map.": "路線一覧のみ掲載しています。詳細な線路形状は地図に表示していません。",
  "Explore the railway map": "鉄道路線図を見る",
  "FIND ROUTE": "経路を検索",
  "FIRST-TIME VISITORS": "初めての方へ",
  "Filter by train line": "路線で絞り込む",
  "Filter map by operator": "鉄道会社で地図を絞り込む",
  "Find your line": "利用する路線を探す",
  "First time riding Tokyo trains?": "東京の電車に初めて乗りますか？",
  "From the airport to Tokyo": "空港から東京へ",
  "Highlight on map": "地図で路線を表示",
  "ILLUSTRATIVE ROUTE GUIDANCE": "経路の参考情報",
  "INTERACTIVE NETWORK": "インタラクティブ路線図",
  "JR East": "JR東日本",
  "LINE DIRECTORY": "路線一覧",
  Legend: "凡例",
  "Lines & station codes": "路線と駅番号",
  "Map coverage": "地図の掲載範囲",
  "Map tiles © OpenStreetMap contributors. Station pins indicate approximate station areas.": "地図タイル © OpenStreetMap contributors。駅のマーカーは駅周辺のおおよその位置です。",
  "Mapped key stops": "地図に表示する主な駅",
  "Navigate Tokyo like a local. Understand the train lines, discover stations, and find your way around Japan's extensive railway network.": "路線や駅を知って、東京の鉄道網を使いこなしましょう。地元の人のように日本の首都を巡るためのガイドです。",
  Nearby: "周辺の見どころ",
  "No matching railway lines.": "該当する路線がありません。",
  "No matching stations or lines.": "該当する駅や路線がありません。",
  "No route details are stored for this station pair. Use the live planner below for current options.": "この駅間の経路情報は掲載していません。最新の経路は下の検索をご利用ください。",
  "Open Google Maps Transit ↗": "Google マップで経路を検索 ↗",
  "Open station in Google Maps ↗": "駅をGoogle マップで開く ↗",
  "Plan a journey": "経路を調べる",
  "Popular journeys": "よく使う経路",
  "ROUTE FINDER": "経路検索",
  "Railway operators and airport access": "鉄道会社と空港アクセス",
  "Reset map": "地図をリセット",
  "STATION INFORMATION": "駅の情報",
  "Search a station or train line...": "駅名または路線名で検索…",
  "Search lines and destinations": "路線・行き先を検索",
  "Selected stations only; intermediate stops are not shown.": "表示しているのは主な駅のみです。途中駅は省略しています。",
  "Services, stopping patterns, prices and reservation rules can change. Confirm the current details with the operator before departure.": "運行区間、停車駅、料金、予約方法は変更されることがあります。出発前に鉄道会社の最新情報をご確認ください。",
  Show: "表示",
  "Start here.": "こちらから。",
  Station: "駅",
  "Station codes and line names shown are reference information; confirm signs at the station.": "駅番号と路線名は参考情報です。駅では案内表示をご確認ください。",
  "Stations and lines": "駅と路線",
  "TOKYO / RAILWAY GUIDE": "東京 / 鉄道ガイド",
  "TOKYO RAILWAY GUIDE": "東京の鉄道ガイド",
  "TOURIST SHORTCUTS": "旅行者向けの経路",
  "This guide highlights eight selected corridors and visitor station areas: Yamanote, Ginza, Asakusa, Hibiya, Marunouchi, Hanzomon, Fukutoshin and Oedo. Colored links are simplified between mapped hubs, not complete track geometry. The map is not a full network, timetable, or live service feed.": "この地図では山手線、銀座線、浅草線、日比谷線、丸ノ内線、半蔵門線、副都心線、大江戸線の主要区間と駅周辺を紹介します。色付きの線は駅間を簡略化したもので、実際の線路形状や全路線、時刻表、運行情報を示すものではありません。",
  "This is an illustrative suggestion, not a live route. Check station signs for the correct platform and current service.": "これは参考例であり、最新の経路案内ではありません。正しい番線と運行状況は駅の案内表示でご確認ください。",
  "This line is listed in the directory, but is not included in the map overlay.": "この路線は一覧に掲載していますが、地図上では表示していません。",
  "Toei Subway": "都営地下鉄",
  "Tokyo Metro": "東京メトロ",
  "Tokyo Metro and Toei Subway are separate operators with separate fares and station gates. Follow the operator and line signs when transferring.": "東京メトロと都営地下鉄は別の事業者で、運賃体系や改札も異なります。乗り換え時は事業者名と路線名の案内に従ってください。",
  "Tokyo railway station": "東京の鉄道駅",
  "Travel times, fares, transfers and platform information are not estimated here.": "所要時間、運賃、乗り換え回数、番線はここでは推定していません。",
  "Type a line, code, or destination": "路線名・駅番号・行き先を入力",
  "Visitor tip": "旅行者向けの案内",
  "Zoom and drag the map. Select a station for visitor information or a highlighted line for its mapped stops.": "地図は拡大・縮小やドラッグができます。駅を選ぶと周辺情報、路線を選ぶと地図上の主な駅が表示されます。",
  "line colors follow common operator line-color references where available. White circles mark selected station areas. Pan and zoom using the map controls.": "路線色は確認できる事業者の一般的な色分けを参考にしています。白い丸は主な駅周辺です。地図の操作ボタンで移動・拡大縮小できます。",
  lines: "路線",
  "the map shows selected station-to-station corridors, not full track geometry.": "地図では駅間の主な区間を簡略表示しており、実際の線路形状は示していません。",
  "JR / urban and regional rail": "JR / 都市・近郊路線",
  "Subway / nine lines": "地下鉄 / 9路線",
  "Subway / four lines": "地下鉄 / 4路線",
  "Regular rail, airport links and special transit": "一般鉄道・空港アクセス・新交通システム",
  "Yamanote Line": "山手線",
  "Chuo Rapid Line": "中央線快速",
  "Chuo-Sobu Local Line": "中央・総武線各駅停車",
  "Keihin-Tohoku Line": "京浜東北線",
  "Saikyo Line": "埼京線",
  "Shonan-Shinjuku Line": "湘南新宿ライン",
  "Yokosuka Line": "横須賀線",
  "Sobu Rapid Line": "総武線快速",
  "Tokaido Line": "東海道線",
  "Keiyo Line": "京葉線",
  "Musashino Line": "武蔵野線",
  "Ueno-Tokyo Line": "上野東京ライン",
  "Joban Rapid Line": "常磐線快速",
  "Joban Local Line": "常磐線各駅停車",
  "Yokohama Line": "横浜線",
  "Nambu Line": "南武線",
  "Tozai Line": "東西線",
  "Chiyoda Line": "千代田線",
  "Yurakucho Line": "有楽町線",
  "Namboku Line": "南北線",
  "Mita Line": "三田線",
  "Shinjuku Line": "新宿線",
  "Odakyu Odawara Line": "小田急小田原線",
  "Keio Line": "京王線",
  "Keio Inokashira Line": "京王井の頭線",
  "Seibu Shinjuku Line": "西武新宿線",
  "Seibu Ikebukuro Line": "西武池袋線",
  "Tobu Skytree Line": "東武スカイツリーライン",
  "Tobu Tojo Line": "東武東上線",
  "Tokyu Toyoko Line": "東急東横線",
  "Tokyu Den-en-toshi Line": "東急田園都市線",
  "Keikyu Line": "京急線",
  "Keisei Line": "京成線",
  "Tsukuba Express": "つくばエクスプレス",
  "Rinkai Line": "りんかい線",
  "Yurikamome Line": "ゆりかもめ",
  "Tokyo Monorail": "東京モノレール",
  "Nippori-Toneri Liner": "日暮里・舎人ライナー",
  "Tokyo Sakura Tram (Toden Arakawa Line)": "東京さくらトラム（都電荒川線）",
  "IC Cards": "ICカード",
  "Understanding stations": "駅の利用方法",
  "Train types": "列車の種類",
  Transfers: "乗り換え",
  "Train etiquette": "車内マナー",
  "Last trains": "終電",
  "JR Yamanote Line toward Shibuya / Shinagawa is a simple example; confirm the platform display.": "JR山手線の渋谷・品川方面が一例です。番線表示をご確認ください。",
  "JR Yamanote Line; check the platform direction and current service.": "JR山手線を利用できます。番線の方面表示と運行状況をご確認ください。",
  "JR Chuo Rapid Line is a common direct option; confirm the departure board.": "JR中央線快速が直通する一例です。発車案内をご確認ください。",
  "Several transfers are possible; use a live planner for the best current route.": "複数の乗り換え経路があります。最新の経路はリアルタイム検索をご利用ください。",
  "JR Chuo-Sobu Local Line is one direct option; check the platform and direction.": "JR中央・総武線各駅停車が直通する一例です。番線と方面をご確認ください。",
  "Use a live planner for the nearest station and walking approach to your chosen tower entrance.": "目的地の入口に近い駅と徒歩経路は、最新の経路検索でご確認ください。",
  "JR Yamanote Line is a common direct option; confirm the direction on the platform.": "JR山手線が直通する一例です。ホームで方面をご確認ください。",
  "JR Keiyo Line serves Maihama for Tokyo Disney Resort; allow time to walk to the Keiyo platforms.": "JR京葉線で舞浜駅へ行けます。東京駅では京葉線ホームまでの移動時間にご注意ください。",
  "Compare Narita Express and other current airport services using a live planner.": "成田エクスプレスなどの空港アクセスを、最新の経路検索で比較してください。",
  "Compare current JR / Keikyu or monorail connections using a live planner.": "JR・京急・モノレールの最新の乗り継ぎを経路検索でご確認ください。",
  "Open a topic for simple, practical advice.": "項目を開いて、簡単で実用的な案内をご覧ください。",
  "Suica and PASMO are rechargeable IC cards used on most participating JR, subway and private railway services, plus many buses and shops.": "SuicaとPASMOは、JR、地下鉄、私鉄などの対応路線や多くのバス・店舗で使えるチャージ式ICカードです。",
  "Buy or charge a card at a station ticket machine or service counter where available. Mobile card options depend on your device and region.": "駅の券売機や窓口で購入・チャージできます。モバイル版の利用可否は端末や地域によって異なります。",
  "Tap once at the entry gate and tap again at the exit gate. Use the same card throughout the trip and keep it ready at the gate.": "改札の入場時と出場時に同じカードをタッチします。改札ではすぐ使えるように準備しましょう。",
  "Station codes combine a line letter with a station number, such as JY20 or G01. Check the code and station name together.": "駅番号は路線記号と数字の組み合わせです（例：JY20、G01）。駅名とあわせて確認しましょう。",
  "Line colors help identify a route, but always confirm the operator, line name and destination on signs and platform displays.": "路線色は目印になりますが、案内表示や発車標で事業者名・路線名・行き先も確認してください。",
  "Platform signs show destinations and train types. Check the direction and stopping pattern before boarding.": "ホームの案内表示で行き先や列車種別を確認し、方面と停車駅を見てから乗車しましょう。",
  "Local trains stop at every station on their route.": "各駅停車は、路線上のすべての駅に停車します。",
  "Rapid and express services skip some stations. Limited Express trains may require a separate limited-express ticket or seat reservation.": "快速や急行は一部の駅を通過します。特急では別途特急券や座席指定が必要な場合があります。",
  "Always check the station's stopping pattern; not every train stops at every station.": "すべての列車が各駅に停車するわけではありません。停車駅を必ずご確認ください。",
  "JR, Tokyo Metro, Toei and private railways are separate operators. Follow signs for the exact line and operator when transferring.": "JR、東京メトロ、都営地下鉄、私鉄は別々の事業者です。乗り換え時は路線名と事業者名の案内に従ってください。",
  "Look for transfer signs and line colors. Some transfers require exiting one fare area or walking between nearby station buildings.": "乗り換え案内と路線色を確認してください。改札を出たり、駅舎間を歩いたりする場合があります。",
  "When using an IC card, follow the transfer gates and signs so your fare is recorded correctly.": "ICカード利用時は、運賃が正しく記録されるよう乗り換え改札と案内表示に従ってください。",
  "Queue behind the marked lines, let passengers exit first, and keep doorways clear.": "乗車位置の表示に沿って並び、降車する人を先に通し、ドア付近を空けましょう。",
  "Keep conversations quiet, avoid phone calls, and keep luggage close without blocking seats or aisles.": "会話は控えめにし、車内通話は避けましょう。荷物は座席や通路をふさがないようにしてください。",
  "Follow each station's escalator guidance; local customs vary by area and can change during busy periods.": "エスカレーターは駅ごとの案内に従ってください。地域や混雑状況によって利用方法が異なる場合があります。",
  "Tokyo trains do not run 24 hours. Check the last departure for your exact route before going out, especially late at night.": "東京の電車は24時間運行ではありません。特に夜遅くに出かける際は、利用する経路の終電を確認しましょう。",
  "Service times, platforms and disruptions change. Use an official operator planner or Google Maps Transit for current journey planning.": "運行時刻、番線、運休情報は変わります。最新の経路検索には鉄道会社の公式案内やGoogle マップをご利用ください。",
  "Narita Express (N'EX)": "成田エクスプレス（N'EX）",
  "Keisei Skyliner": "京成スカイライナー",
  "Keisei Access Express": "京成アクセス特急",
  "Keikyu Airport Line": "京急空港線",
  "JR service to major terminals including Tokyo, Shinagawa, Shibuya and Shinjuku; check the current train pattern and reservation requirements.": "東京、品川、渋谷、新宿などへ向かうJRの列車です。運行区間と指定席の条件は最新情報をご確認ください。",
  "Limited Express service between Narita Airport and Keisei-Ueno / Nippori; reserved seating and separate ticket.": "成田空港と京成上野・日暮里を結ぶ特急列車です。座席指定と別途乗車券が必要です。",
  "Through services may continue onto the Toei Asakusa Line and other lines; destination varies by service.": "都営浅草線などへの直通列車があります。行き先は列車によって異なります。",
  "Connects the airport with Shinagawa and offers through services; confirm the destination shown on the train.": "空港と品川を結び、他路線への直通列車もあります。列車の行き先表示をご確認ください。",
  "Connects the airport with Hamamatsucho, where JR Yamanote and Keihin-Tohoku services are available.": "空港と浜松町を結び、浜松町ではJR山手線・京浜東北線に乗り換えられます。",
  "NARITA AIRPORT": "成田空港",
  "HANEDA AIRPORT": "羽田空港",
  "Shinjuku Gyoen, Kabukicho, Tokyo Metropolitan Government Building": "新宿御苑、歌舞伎町、東京都庁",
  "Shinjuku Station is very large; follow the operator and exit signs for your destination.": "新宿駅は広大です。利用する事業者と目的地に合った出口の案内に従ってください。",
  "Shibuya Scramble Crossing, Shibuya Sky, Hachiko Memorial Statue": "渋谷スクランブル交差点、渋谷スカイ、忠犬ハチ公像",
  "Use the Hachiko Exit for the Scramble Crossing.": "スクランブル交差点へはハチ公改札・ハチ公口をご利用ください。",
  "Meiji Jingu, Takeshita Street, Omotesando": "明治神宮、竹下通り、表参道",
  "Meiji-jingumae is a separate nearby station served by Tokyo Metro.": "明治神宮前駅は近隣にある別の東京メトロの駅です。",
  "Tokyo Station Marunouchi Building, Imperial Palace East Gardens": "東京駅丸の内駅舎、皇居東御苑",
  "Use the Marunouchi side for the historic station building and the Yaesu side for many Shinkansen gates.": "歴史的な駅舎へは丸の内側、新幹線改札へは八重洲側の案内をご確認ください。",
  "Ueno Park, Tokyo National Museum, Ameyoko": "上野公園、東京国立博物館、アメ横",
  "Ueno Park and museums are on the Park side of the JR station.": "上野公園や博物館へはJR駅の公園口側が便利です。",
  "Sunshine City, Ikebukuro shopping district": "サンシャインシティ、池袋の繁華街",
  "The station has several operators; check the operator name before entering a gate.": "複数の事業者が乗り入れています。改札に入る前に事業者名をご確認ください。",
  "Shinagawa Station area, Takanawa Gateway": "品川駅周辺、高輪ゲートウェイ",
  "Keikyu platforms connect the station area with Haneda Airport services.": "京急のホームから羽田空港方面の列車に乗車できます。",
  "Akihabara Electric Town, Kanda Myojin": "秋葉原電気街、神田明神",
  "Use the Electric Town Exit for the main electronics and anime shopping streets.": "電気街やアニメ関連の店舗へは電気街口をご利用ください。",
  "Ginza shopping district, Kabukiza Theatre": "銀座の繁華街、歌舞伎座",
  "Ginza and Higashi-ginza are connected by underground passages but are separate stations.": "銀座駅と東銀座駅は地下通路でつながっていますが、別の駅です。",
  "Senso-ji, Kaminarimon, Nakamise Street": "浅草寺、雷門、仲見世通り",
  "Follow signs for Kaminarimon and Senso-ji; several operators have separate gates.": "雷門・浅草寺方面の案内をご確認ください。事業者ごとに改札が異なります。",
  "Roppongi Hills, Mori Art Museum, Tokyo Midtown": "六本木ヒルズ、森美術館、東京ミッドタウン",
  "Roppongi Hills and Tokyo Midtown are in different directions from the station.": "六本木ヒルズと東京ミッドタウンは駅から別方向にあります。",
  "Shiodome, Hamarikyu Gardens, gateway to Odaiba": "汐留、浜離宮恩賜庭園、お台場への乗換駅",
  "Yurikamome has its own station and gate area; follow the dedicated signs.": "ゆりかもめは駅と改札が別です。専用の案内表示に従ってください。",
  "Odaiba Seaside Park, waterfront museums and shopping": "お台場海浜公園、臨海部の美術館、ショッピング施設",
  "Odaiba has several stations; choose the one closest to your destination.": "お台場には複数の駅があります。目的地に近い駅をお選びください。",
  "Tokyo Disney Resort": "東京ディズニーリゾート",
  "Follow the resort signs from the south side of the station.": "駅の南側からリゾート方面の案内に従ってください。",
  "Tokyo Skytree, Tokyo Solamachi": "東京スカイツリー、東京ソラマチ",
  "Oshiage is the station name for Tokyo Skytree; follow the Skytree exit signs.": "東京スカイツリーの最寄り駅名は押上です。スカイツリー方面の出口案内に従ってください。",
};

const japaneseDynamicCopy = {
  "PRIVATE RAILWAYS & SPECIAL TRANSIT": "私鉄・空港アクセス・新交通システム",
  "Yamanote Line": "山手線",
  "Chuo Rapid Line": "中央線快速",
  "Chuo-Sobu Local Line": "中央・総武線各駅停車",
  "Keihin-Tohoku Line": "京浜東北線",
  "Saikyo Line": "埼京線",
  "Shonan-Shinjuku Line": "湘南新宿ライン",
  "Yokosuka Line": "横須賀線",
  "Sobu Rapid Line": "総武線快速",
  "Tokaido Line": "東海道線",
  "Keiyo Line": "京葉線",
  "Musashino Line": "武蔵野線",
  "Ueno-Tokyo Line": "上野東京ライン",
  "Joban Rapid Line": "常磐線快速",
  "Joban Local Line": "常磐線各駅停車",
  "Yokohama Line": "横浜線",
  "Nambu Line": "南武線",
  "Ginza Line": "銀座線",
  "Marunouchi Line": "丸ノ内線",
  "Hibiya Line": "日比谷線",
  "Tozai Line": "東西線",
  "Chiyoda Line": "千代田線",
  "Yurakucho Line": "有楽町線",
  "Hanzomon Line": "半蔵門線",
  "Namboku Line": "南北線",
  "Fukutoshin Line": "副都心線",
  "Asakusa Line": "浅草線",
  "Mita Line": "三田線",
  "Shinjuku Line": "新宿線",
  "Oedo Line": "大江戸線",
  "Odakyu Odawara Line": "小田急小田原線",
  "Keio Line": "京王線",
  "Keio Inokashira Line": "京王井の頭線",
  "Seibu Shinjuku Line": "西武新宿線",
  "Seibu Ikebukuro Line": "西武池袋線",
  "Tobu Skytree Line": "東武スカイツリーライン",
  "Tobu Tojo Line": "東武東上線",
  "Tokyu Toyoko Line": "東急東横線",
  "Tokyu Den-en-toshi Line": "東急田園都市線",
  "Keikyu Line": "京急線",
  "Keisei Line": "京成線",
  "Tsukuba Express": "つくばエクスプレス",
  "Rinkai Line": "りんかい線",
  "Yurikamome Line": "ゆりかもめ",
  "Tokyo Monorail": "東京モノレール",
  "Nippori-Toneri Liner": "日暮里・舎人ライナー",
  "Tokyo Sakura Tram (Toden Arakawa Line)": "東京さくらトラム（都電荒川線）",
  "Tokyo's circular line; Shinjuku, Shibuya, Harajuku, Tokyo, Ueno and Ikebukuro.": "東京を環状に走る路線で、新宿、渋谷、原宿、東京、上野、池袋などを結びます。",
  "Tokyo–Shinjuku–Tachikawa–Hachioji; faster service with fewer stops than the local service.": "東京・新宿から立川・八王子方面へ向かう快速列車です。各駅停車より停車駅が少なく、速く移動できます。",
  "Local service through Shinjuku, Akihabara and onward toward Chiba; stops more frequently than the Chuo Rapid.": "新宿、秋葉原を経由して千葉方面へ向かう各駅停車です。中央線快速より多くの駅に停車します。",
  "Omiya–Ueno–Tokyo–Shinagawa–Yokohama corridor.": "大宮・上野・東京・品川・横浜を結ぶ路線です。",
  "Omiya–Ikebukuro–Shinjuku–Shibuya–Osaki corridor.": "大宮・池袋・新宿・渋谷・大崎方面を結ぶ路線です。",
  "Through service linking the Shinjuku area with destinations in the north and south.": "新宿エリアを経由し、北部・南部の各方面を結ぶ直通運転です。",
  "Tokyo–Shinagawa and through service toward Yokosuka.": "東京・品川から横須賀方面へ直通運転しています。",
  "Tokyo–Chiba rapid service; shares the JO station-code family with Yokosuka services.": "東京・千葉間の快速列車です。横須賀線と共通のJO駅番号を使用します。",
  "Tokyo–Shinagawa and onward toward Yokohama and the Tokaido corridor.": "東京・品川から横浜や東海道方面へ向かいます。",
  "Tokyo–Maihama (Tokyo Disney Resort)–Soga.": "東京・舞浜（東京ディズニーリゾート）・蘇我方面を結びます。",
  "Suburban orbital service connecting western and eastern Tokyo-area railways.": "東京近郊の西部・東部の路線を結ぶ郊外環状路線です。",
  "Through service connecting Ueno with Tokyo Station and southern lines.": "上野と東京駅を結び、南方面の路線へ直通します。",
  "Ueno–Matsudo–Abiko–Toride corridor.": "上野・松戸・我孫子・取手方面を結びます。",
  "Local service through the northern Tokyo suburbs, including Matsudo and Abiko.": "松戸・我孫子など東京北東部の近郊を走る各駅停車です。",
  "Higashi-Kanagawa–Shin-Yokohama–Hachioji.": "東神奈川・新横浜・八王子方面を結びます。",
  "Kawasaki–Musashi-Kosugi–Tachikawa.": "川崎・武蔵小杉・立川方面を結びます。",
  "Shibuya–Ginza–Ueno–Asakusa.": "渋谷・銀座・上野・浅草を結びます。",
  "Ikebukuro–Tokyo–Shinjuku.": "池袋・東京・新宿方面を結びます。",
  "Naka-meguro–Roppongi–Ginza–Ueno.": "中目黒・六本木・銀座・上野方面を結びます。",
  "Nakano–Otemachi–Nishi-funabashi.": "中野・大手町・西船橋を結びます。",
  "Yoyogi-uehara–Omotesando–Otemachi–Kita-ayase.": "代々木上原・表参道・大手町・北綾瀬を結びます。",
  "Wakoshi–Ikebukuro–Yurakucho–Shin-kiba.": "和光市・池袋・有楽町・新木場を結びます。",
  "Shibuya–Otemachi–Oshiage.": "渋谷・大手町・押上を結びます。",
  "Meguro–Nagatacho–Akabane-iwabuchi.": "目黒・永田町・赤羽岩淵を結びます。",
  "Shibuya–Shinjuku-sanchome–Ikebukuro.": "渋谷・新宿三丁目・池袋を結びます。",
  "Nishi-magome–Shimbashi–Asakusa–Oshiage.": "西馬込・新橋・浅草・押上を結びます。",
  "Meguro–Hibiya–Otemachi–Nishi-takashimadaira.": "目黒・日比谷・大手町・西高島平を結びます。",
  "Shinjuku–Jimbocho–Motoyawata.": "新宿・神保町・本八幡を結びます。",
  "Looping route serving Shinjuku, Roppongi, Tsukiji and Ueno-okachimachi.": "新宿・六本木・築地・上野御徒町などを巡る環状路線です。",
  "Shinjuku–Odawara; access toward Hakone and other western destinations.": "新宿・小田原間を結び、箱根など西方面へのアクセスに便利です。",
  "Shinjuku–Keio-hachioji.": "新宿・京王八王子間を結びます。",
  "Shibuya–Kichijoji.": "渋谷・吉祥寺間を結びます。",
  "Seibu-shinjuku–Hon-kawagoe.": "西武新宿・本川越間を結びます。",
  "Ikebukuro–Chichibu / western suburban destinations.": "池袋から秩父など西部の郊外へ向かいます。",
  "Asakusa / Oshiage–Tobu-dobutsu-koen and beyond.": "浅草・押上から東武動物公園方面へ向かいます。",
  "Ikebukuro–Kawagoe / Saitama destinations.": "池袋から川越など埼玉方面へ向かいます。",
  "Shibuya–Yokohama; through services connect with the Fukutoshin Line.": "渋谷・横浜間を結び、副都心線との直通運転があります。",
  "Shibuya–western suburbs; through services connect with the Hanzomon Line.": "渋谷から西部の郊外へ向かい、半蔵門線と直通運転しています。",
  "Shinagawa–Haneda Airport and Yokohama directions.": "品川から羽田空港・横浜方面へ向かいます。",
  "Keisei-ueno / Nippori–Narita Airport and Chiba.": "京成上野・日暮里から成田空港・千葉方面へ向かいます。",
  "Akihabara–Tsukuba.": "秋葉原・つくば間を結びます。",
  "Shin-kiba–Tokyo Teleport / Odaiba–Osaki.": "新木場・東京テレポート（お台場）・大崎方面を結びます。",
  "Shimbashi–Odaiba–Toyosu; automated elevated transit.": "新橋・お台場・豊洲を結ぶ自動運転の高架交通システムです。",
  "Hamamatsucho–Haneda Airport; airport monorail.": "浜松町・羽田空港間を結ぶ空港モノレールです。",
  "Nippori–Minumadai-shinsuikōen; automated transit.": "日暮里・見沼代親水公園間を結ぶ自動運転の交通システムです。",
  "Waseda–Minowabashi; street-running tram.": "早稲田・三ノ輪橋間を結ぶ路面電車です。",
  "Meiji-jingumae": "明治神宮前",
  "Nihombashi": "日本橋",
  "Oshiage / Skytree": "押上 / スカイツリー",
  "Daikanyama": "代官山",
  "Shinjuku-sanchome": "新宿三丁目",
  "Omote-sando": "表参道",
  "Naka-meguro": "中目黒",
  "Nishi-magome": "西馬込",
  "Ueno-okachimachi": "上野御徒町",
  "Ryogoku": "両国",
  "Tokyo Tower": "東京タワー",
  "Narita Airport": "成田空港",
  "Haneda Airport": "羽田空港",
  "JR Yamanote JY20": "JR山手線 JY20",
  "JR Saikyo JA10": "JR埼京線 JA10",
  "Ginza G01": "銀座線 G01",
  "Hanzomon Z01": "半蔵門線 Z01",
  "Fukutoshin F16": "副都心線 F16",
  "Tokyu Toyoko TY01": "東急東横線 TY01",
  "Tokyu Den-en-toshi DT01": "東急田園都市線 DT01",
  "Keio Inokashira IN01": "京王井の頭線 IN01",
  "JR Yamanote JY17": "JR山手線 JY17",
  "JR Chuo Rapid JC05": "JR中央線快速 JC05",
  "JR Chuo-Sobu JB10": "JR中央・総武線各駅停車 JB10",
  "JR Saikyo JA11": "JR埼京線 JA11",
  "Marunouchi M08": "丸ノ内線 M08",
  "Toei Shinjuku S01": "都営新宿線 S01",
  "Toei Oedo E27": "都営大江戸線 E27",
  "JR Yamanote JY19": "JR山手線 JY19",
  "Fukutoshin F15 (Meiji-jingumae)": "副都心線 F15（明治神宮前）",
  "JR Yamanote JY01": "JR山手線 JY01",
  "JR Chuo Rapid JC01": "JR中央線快速 JC01",
  "JR Tokaido JT01": "JR東海道線 JT01",
  "JR Ueno-Tokyo JU01": "JR上野東京ライン JU01",
  "Marunouchi M17": "丸ノ内線 M17",
  "JR Yamanote JY05": "JR山手線 JY05",
  "JR Keihin-Tohoku JK30": "JR京浜東北線 JK30",
  "JR Joban Rapid JJ01": "JR常磐線快速 JJ01",
  "Ginza G16": "銀座線 G16",
  "Hibiya H17": "日比谷線 H17",
  "JR Yamanote JY13": "JR山手線 JY13",
  "JR Saikyo JA12": "JR埼京線 JA12",
  "Marunouchi M25": "丸ノ内線 M25",
  "Fukutoshin F09": "副都心線 F09",
  "Seibu Ikebukuro SI01": "西武池袋線 SI01",
  "Tobu Tojo TJ01": "東武東上線 TJ01",
  "JR Yamanote JY25": "JR山手線 JY25",
  "JR Keihin-Tohoku JK20": "JR京浜東北線 JK20",
  "JR Tokaido JT03": "JR東海道線 JT03",
  "JR Yokosuka JO17": "JR横須賀線 JO17",
  "Keikyu KK01": "京急線 KK01",
  "JR Yamanote JY03": "JR山手線 JY03",
  "JR Keihin-Tohoku JK28": "JR京浜東北線 JK28",
  "JR Chuo-Sobu JB19": "JR中央・総武線各駅停車 JB19",
  "Hibiya H16": "日比谷線 H16",
  "Ginza G09": "銀座線 G09",
  "Marunouchi M16": "丸ノ内線 M16",
  "Hibiya H09": "日比谷線 H09",
  "Asakusa A11 (Higashi-ginza)": "浅草線 A11（東銀座）",
  "Ginza G19": "銀座線 G19",
  "Toei Asakusa A18": "都営浅草線 A18",
  "Tobu Skytree TS01": "東武スカイツリーライン TS01",
  "Hibiya H04": "日比谷線 H04",
  "Toei Oedo E23": "都営大江戸線 E23",
  "JR Yamanote JY29": "JR山手線 JY29",
  "JR Keihin-Tohoku JK24": "JR京浜東北線 JK24",
  "Ginza G08": "銀座線 G08",
  "Toei Asakusa A10": "都営浅草線 A10",
  "Yurikamome U01": "ゆりかもめ U01",
  "Yurikamome Daiba U07": "ゆりかもめ 台場 U07",
  "Rinkai Tokyo Teleport R04 (nearby)": "りんかい線 東京テレポート R04（近隣）",
  "JR Keiyo JE07": "JR京葉線 JE07",
  "Hanzomon Z14": "半蔵門線 Z14",
  "Toei Asakusa A20": "都営浅草線 A20",
  "Tobu Skytree TS30": "東武スカイツリーライン TS30",
};

const kanaToJapaneseTerms = [
  ["とうきょうすかいつりー", "東京スカイツリー"],
  ["とうきょうめとろ", "東京メトロ"],
  ["めいじじんぐう", "明治神宮"],
  ["とえいちかてつ", "都営地下鉄"],
  ["とうきょうちかてつ", "東京地下鉄"],
  ["とうきょうたわー", "東京タワー"],
  ["すくらんぶるこうさてん", "スクランブル交差点"],
  ["すくらんぶる", "スクランブル"],
  ["じんぐうまえ", "神宮前"],
  ["しぶやぱるこ", "渋谷パルコ"],
  ["おもてさんどう", "表参道"],
  ["よよぎこうえん", "代々木公園"],
  ["とうきょう", "東京"],
  ["にほん", "日本"],
  ["しぶや", "渋谷"],
  ["あさくさ", "浅草"],
  ["しんじゅく", "新宿"],
  ["はらじゅく", "原宿"],
  ["だいかんやま", "代官山"],
  ["あきはばら", "秋葉原"],
  ["かまくら", "鎌倉"],
  ["かわぐちこ", "河口湖"],
  ["ふじさん", "富士山"],
  ["よよぎ", "代々木"],
  ["ろっぽんぎ", "六本木"],
  ["ぎんざ", "銀座"],
  ["みなと", "港"],
  ["すみだ", "墨田"],
  ["たいとう", "台東"],
  ["かながわ", "神奈川"],
  ["やまなし", "山梨"],
  ["でんきせいひん", "電気製品"],
  ["でんとうこうげい", "伝統工芸"],
  ["ちかてつ", "地下鉄"],
  ["でんしゃ", "電車"],
  ["ろせんず", "路線図"],
  ["ろせん", "路線"],
  ["うんちん", "運賃"],
  ["じこくひょう", "時刻表"],
  ["のりかえ", "乗り換え"],
  ["しゅっぱつ", "出発"],
  ["とうちゃく", "到着"],
  ["きっぷ", "切符"],
  ["えき", "駅"],
  ["ちず", "地図"],
  ["りょこうしゃ", "旅行者"],
  ["りょこう", "旅行"],
  ["めんぜい", "免税"],
  ["しょうひぜい", "消費税"],
  ["ぱすぽーと", "パスポート"],
  ["こうしき", "公式"],
  ["かくにん", "確認"],
  ["よやく", "予約"],
  ["えいぎょうじかん", "営業時間"],
  ["こうにゅう", "購入"],
  ["しはらい", "支払い"],
  ["へんきん", "返金"],
  ["たいしょう", "対象"],
  ["おとな", "大人"],
  ["こうつう", "交通"],
  ["しょっぴんぐ", "ショッピング"],
  ["ふぁっしょん", "ファッション"],
  ["すとりーとうぇあ", "ストリートウェア"],
  ["すにーかー", "スニーカー"],
  ["びんてーじ", "ヴィンテージ"],
  ["かめら", "カメラ"],
  ["あくせさりー", "アクセサリー"],
  ["ぶんぼうぐ", "文房具"],
  ["でざいん", "デザイン"],
  ["らいふすたいる", "ライフスタイル"],
  ["ぶらんど", "ブランド"],
  ["ひゃっかてん", "百貨店"],
  ["こうきゅうひん", "高級品"],
  ["おみやげ", "お土産"],
  ["こうげいひん", "工芸品"],
  ["きっちんようひん", "キッチン用品"],
  ["でんき", "電気"],
  ["ねおん", "ネオン"],
  ["らいぶかめら", "ライブカメラ"],
  ["めとろ", "メトロ"],
  ["ばす", "バス"],
  ["こんびに", "コンビニ"],
  ["らーめん", "ラーメン"],
  ["こーひー", "コーヒー"],
  ["すし", "寿司"],
  ["とりい", "鳥居"],
  ["じんじゃ", "神社"],
  ["おてら", "お寺"],
  ["しばこうえん", "芝公園"],
  ["こうさてん", "交差点"],
  ["ひゃく", "百"],
  ["よる", "夜"],
  ["ひる", "昼"],
  ["あさ", "朝"],
  ["ゆうがた", "夕方"],
  ["はる", "春"],
  ["あき", "秋"],
  ["なつ", "夏"],
  ["ふゆ", "冬"],
  ["もり", "森"],
  ["にわ", "庭"],
  ["みち", "道"],
  ["まち", "街"],
  ["けしき", "景色"],
  ["じかん", "時間"],
  ["ばしょ", "場所"],
  ["かいもの", "買い物"],
  ["たべもの", "食べ物"],
  ["おかね", "お金"],
  ["げんきん", "現金"],
  ["のりほうだい", "乗り放題"],
  ["みどり", "緑"],
  ["しずか", "静か"],
  ["でんとう", "伝統"],
  ["しぜん", "自然"],
  ["しつもん", "質問"],
  ["なまえ", "名前"],
  ["めーる", "メール"],
  ["れんらく", "連絡"],
  ["めっせーじ", "メッセージ"],
  ["こーす", "コース"],
  ["すらいど", "スライド"],
  ["すわいぷ", "スワイプ"],
  ["びゅー", "ビュー"],
  ["ふぇすてぃばる", "フェスティバル"],
  ["いんすたぐらむ", "Instagram"],
  ["ふぇいすぶっく", "Facebook"],
  ["ぎっとはぶ", "GitHub"],
  ["ぐーぐるまっぷ", "Googleマップ"],
  ["すいか", "Suica"],
  ["ぱすも", "PASMO"],
  ["あいしー", "IC"],
  ["たっちけっさい", "タッチ決済"],
  ["ふぁみりー", "ファミリー"],
  ["ほてる", "ホテル"],
  ["びる", "ビル"],
  ["すかい", "スカイ"],
  ["さくら", "桜"],
  ["よくある", "よくある"],
  ["おすすめ", "おすすめ"],
  ["とうきょう", "東京"],
];

const kanaToJapaneseTermsSorted = [...kanaToJapaneseTerms].sort(([left], [right]) => right.length - left.length);

function toJapaneseScript(text) {
  return kanaToJapaneseTermsSorted.reduce((result, [kana, japanese]) => result.replaceAll(kana, japanese), text);
}

function getJapaneseCopy(text) {
  return japaneseUiOverrides[text] ?? japaneseDynamicCopy[text] ?? toJapaneseScript(extendedJapaneseCopy[text] ?? japaneseCopy[text] ?? text);
}

function useCopy() {
  const japanese = useContext(JapaneseContext);
  return (text) => japanese ? getJapaneseCopy(text) : text;
}

const gallery = [
  { number: "01 / 12", title: "SHIBUYA AFTER DARK", location: "Shibuya Crossing", category: "NIGHT", fit: "contain", image: "https://images.pexels.com/photos/31001134/pexels-photo-31001134.jpeg?cs=srgb&fm=jpg" },
  { number: "02 / 12", title: "SENSO-JI AT NIGHT", location: "Asakusa", category: "CULTURE", fit: "contain", image: "https://images.pexels.com/photos/14703207/pexels-photo-14703207.jpeg?cs=srgb&fm=jpg" },
  { number: "03 / 12", title: "MEIJI JINGU / SAKE BARRELS", location: "Meiji Jingu", category: "CULTURE", fit: "contain", image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Meiji_Jingu_Shrine._Saki_Barrels._%2827915377617%29.jpg" },
  { number: "04 / 12", title: "TOKYO SKYTREE", location: "Sumida", category: "CITY", fit: "contain", image: "https://images.pexels.com/photos/12536680/pexels-photo-12536680.jpeg?cs=srgb&fm=jpg" },
  { number: "05 / 12", title: "DAIKANYAMA / T-SITE", location: "Daikanyama", category: "DESIGN", fit: "contain", image: "https://images.pexels.com/photos/29241321/pexels-photo-29241321.jpeg?cs=srgb&fm=jpg" },
  { number: "06 / 12", title: "TOKYO TOWER", location: "Minato", category: "CITY", fit: "contain", image: "https://images.pexels.com/photos/19035824/pexels-photo-19035824.jpeg?cs=srgb&fm=jpg" },
  { number: "07 / 12", title: "SHINJUKU NIGHTS", location: "Shinjuku", category: "NIGHT", fit: "contain", image: "https://images.pexels.com/photos/35970334/pexels-photo-35970334.jpeg?cs=srgb&fm=jpg" },
  { number: "08 / 12", title: "TOKYO BY TRAIN", location: "Tokyo rail network", category: "RAIL", fit: "contain", image: "https://images.pexels.com/photos/31385056/pexels-photo-31385056.jpeg?cs=srgb&fm=jpg" },
  { number: "09 / 12", title: "A TASTE OF TOKYO", location: "Tokyo", category: "FOOD", fit: "contain", image: "https://images.pexels.com/photos/29502503/pexels-photo-29502503.jpeg?cs=srgb&fm=jpg" },
  { number: "10 / 12", title: "CITY, THEN GREEN", location: "Yoyogi / Shibuya", category: "NATURE", fit: "contain", image: "https://images.pexels.com/photos/31298878/pexels-photo-31298878.jpeg?cs=srgb&fm=jpg" },
  { number: "11 / 12", title: "KAMAKURA COAST", location: "Kamakura, Kanagawa", category: "NATURE", fit: "contain", image: "https://images.unsplash.com/photo-1706516510664-a8d1e7577eeb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FtYWt1cmElMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D" },
  { number: "12 / 12", title: "FUJI / LAKE KAWAGUCHI", location: "Lake Kawaguchi, Yamanashi", category: "NATURE", fit: "contain", image: "https://images.pexels.com/photos/21759296/pexels-photo-21759296.jpeg?cs=srgb&dl=pexels-andrey-grushnikov-223358-21759296.jpg&fm=jpg" },
];

const wayfindingLocations = [
  { number: "01", name: "Shibuya Crossing", district: "Shibuya", coordinates: [139.7006, 35.6595], description: "The famous scramble, surrounded by shopping, food and late-night streets." },
  { number: "02", name: "Meiji Jingu", district: "Harajuku", coordinates: [139.6993, 35.6764], description: "A forested shrine reached through the quiet paths of Yoyogi." },
  { number: "03", name: "Tokyo Station", district: "Marunouchi", coordinates: [139.7671, 35.6812], description: "A major rail hub with the Imperial Palace gardens close by." },
  { number: "04", name: "Senso-ji", district: "Asakusa", coordinates: [139.7967, 35.7148], description: "Tokyo's oldest temple and the lantern-lined streets of Asakusa." },
  { number: "05", name: "Tokyo Skytree", district: "Sumida", coordinates: [139.8107, 35.7101], description: "An observation deck above the Sumida River and old-town Tokyo." },
];

const homepagePhotoRows = [
  [
    { src: "https://images.pexels.com/photos/35827257/pexels-photo-35827257.jpeg?cs=srgb&fm=jpg", alt: "Shibuya crossing and buildings at night", label: "SHIBUYA / NIGHT" },
    { src: "https://images.pexels.com/photos/37672825/pexels-photo-37672825.jpeg?cs=srgb&fm=jpg", alt: "Aerial night view of Shibuya Crossing", label: "SHIBUYA / CROSSING" },
    { src: "https://c0.wallpaperflare.com/preview/419/330/371/odaiba-japan-tokyo-rainbow-bridge.jpg", alt: "Odaiba waterfront and Rainbow Bridge in Tokyo", label: "ODAIBA / RAINBOW BRIDGE" },
    { src: "https://images.pexels.com/photos/31298878/pexels-photo-31298878.jpeg?cs=srgb&fm=jpg", alt: "Aerial view across Tokyo", label: "SHIBUYA / FROM ABOVE" },
    { src: "https://images.pexels.com/photos/14703207/pexels-photo-14703207.jpeg?cs=srgb&fm=jpg", alt: "Senso-ji temple in Asakusa", label: "ASAKUSA / CULTURE" },
  ],
  [
    { src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0", alt: "Shinjuku streets illuminated at night in Tokyo", label: "SHINJUKU / AFTER DARK" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Meiji_Jingu_Shrine._Saki_Barrels._%2827915377617%29.jpg", alt: "Sake barrels at Meiji Jingu", label: "MEIJI JINGU / FOREST" },
    { src: "https://images.pexels.com/photos/19035824/pexels-photo-19035824.jpeg?cs=srgb&fm=jpg", alt: "Tokyo Tower at twilight", label: "MINATO / TWILIGHT" },
    { src: "https://images.pexels.com/photos/29502503/pexels-photo-29502503.jpeg?cs=srgb&fm=jpg", alt: "Sushi platter at a Tokyo restaurant", label: "TOKYO / FOOD" },
    { src: "https://images.pexels.com/photos/31385056/pexels-photo-31385056.jpeg?cs=srgb&fm=jpg", alt: "Train platform in Tokyo", label: "TOKYO / BY RAIL" },
  ],
];

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return null;
}

function Header({ onMenu, onPlay, path, menuOpen }) {
  const t = useCopy();
  const mobileLinks = [
    { href: "/", label: "HOME", Icon: House },
    { href: "/things-to-do", label: "THINGS TO DO", Icon: MapPin },
    { href: "/train", label: "TRAIN", Icon: TrainFront },
    { href: "/gallery", label: "GALLERY", Icon: Images },
    { href: "/faq", label: "FAQ", Icon: CircleHelp },
  ];

  return (
    <header className={`site-header${menuOpen ? " is-menu-open" : ""}`}>
      <a className="brand" href="/">
        {t("TOKYO")}
      </a>

      <nav className="desktop-nav">
        <a href="/">{t("HOME")}</a>
        <a href="/things-to-do">{t("THINGS TO DO")}</a>
        <a href="/train">{t("TRAIN")}</a>
        <a href="/gallery">{t("GALLERY")}</a>
        <a href="/faq">{t("FAQ")}</a>
        <a href="/reach-out">{t("REACH OUT")}</a>
        <a href="/settings">{t("SETTINGS")}</a>
      </nav>

      <div className="header-actions">
        <button className="header-music-button" type="button" onClick={onPlay} aria-label={t("Open wanna feel tokyo? music player")}>
          <span aria-hidden="true">▶</span>
          <span>{t("PLAY")}</span>
        </button>
        <button className={`menu-button ${menuOpen ? "is-open" : ""}`} onClick={onMenu} aria-label={t(menuOpen ? "Close menu" : "Open menu")} aria-expanded={menuOpen} aria-controls="mobile-menu">
          <span />
          <span />
        </button>
      </div>

      <nav className="mobile-nav-dock" aria-label={t("Main navigation")}>
        {mobileLinks.map(({ href, label, Icon }) => (
          <a key={href} href={href} aria-label={t(label)} aria-current={path === href ? "page" : undefined} title={t(label)}>
            <Icon aria-hidden="true" />
          </a>
        ))}
        <button type="button" onClick={onMenu} aria-label={t(menuOpen ? "Close menu" : "More navigation")} aria-expanded={menuOpen} aria-controls="mobile-menu" title={t("More navigation")}>
          {menuOpen ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
      </nav>
    </header>
  );
}

function MobileMenu({ open, close, path }) {
  const t = useCopy();

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, close]);

  if (!open) return null;
  return (
    <div className="mobile-menu" id="mobile-menu">
      <button className="menu-close" onClick={close}>
        {t("CLOSE")}
      </button>

      <div className="mobile-menu-inner">
        <span className="menu-kicker">{t("TOKYO / NAVIGATION")}</span>

        <a onClick={close} href="/">{t("HOME")}</a>

        <a onClick={close} href="/things-to-do">
          {t("THINGS TO DO")}
        </a>

        <a onClick={close} href="/train">
          {t("TRAIN")}
        </a>

        <a onClick={close} href="/gallery">
          {t("GALLERY")}
        </a>

        <a onClick={close} href="/faq">{t("FAQ")}</a>
        <a onClick={close} href="/reach-out">{t("REACH OUT")}</a>
        <a onClick={close} href="/settings">{t("SETTINGS")}</a>

      </div>
    </div>
  );
}

function Place({ place, index }) {
  const t = useCopy();

  return (
    <article className="destination-card" id={place.name.toLowerCase().replaceAll(" ", "-")}>
      <div className="destination-cover">
        <OptimizedImage src={place.image} alt={t(place.name)} loading={index ? "lazy" : "eager"} priority={index === 0} sizes="(max-width: 850px) 100vw, 58vw" />
        <span className="destination-number">{place.number}</span>
        <span className="destination-notch" aria-hidden="true" />
        <span className="destination-fillet destination-fillet-right" aria-hidden="true" />
        <span className="destination-fillet destination-fillet-bottom" aria-hidden="true" />
        <a className="destination-arrow" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery ?? `${place.name}, Japan`)}`} target="_blank" rel="noopener noreferrer" aria-label={`${t("Find on map")}: ${t(place.name)} (Google Maps, opens in a new tab)`}>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="destination-copy">
        <div className="destination-kicker"><span>{t(place.tag)}</span><span>{t(place.jp)}</span></div>
        <h3>{t(place.name)}</h3>
        <p>{t(place.description)}</p>
        <div className="destination-meta"><span>{t(place.area)}</span><span>{t(place.hours)}</span></div>
      </div>
    </article>
  );
}

function ScrollVelocityContainer({ children }) {
  return <div className="scroll-velocity-container">{children}</div>;
}

function ScrollVelocityRow({ images, direction = 1, speed = 86 }) {
  const t = useCopy();
  const repeatedImages = [...images, ...images];

  return (
    <div className={`scroll-velocity-row ${direction > 0 ? "scroll-direction-forward" : "scroll-direction-reverse"}`}>
      <div className="scroll-velocity-track" style={{ "--marquee-duration": `${speed}s` }}>
        {repeatedImages.map((image, index) => (
          <figure className="scroll-velocity-photo" key={`${image.src}-${index}`} aria-hidden={index >= images.length}>
            <OptimizedImage src={image.src} alt={index < images.length ? image.alt : ""} loading="lazy" decoding="async" sizes="(max-width: 850px) 88vw, 28vw" />
            <figcaption>{t(image.label)}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function TokyoPhotoReel() {
  const t = useCopy();
  return (
    <section className="photo-reel" aria-label={t("Tokyo photography")}>
      <div className="photo-reel-heading">
        <div>
          <span className="section-label">{t("TOKYO / IN MOTION")}</span>
          <h2>{t("Different sides.")}<br />{t("One city.")}</h2>
        </div>
        <p>{t("Crossings, quiet paths, late trains and the neighborhoods in between.")}</p>
      </div>
      <ScrollVelocityContainer>
        <ScrollVelocityRow images={homepagePhotoRows[0]} speed={88} direction={1} />
        <ScrollVelocityRow images={homepagePhotoRows[1]} speed={102} direction={-1} />
      </ScrollVelocityContainer>
    </section>
  );
}

function MusicPrompt({ onPlay, active }) {
  const t = useCopy();
  return (
    <section className={`music-section ${active ? "music-active" : ""}`} id="soundtrack">
      <div className="music-background">
        <div className="music-orb orb-one" />
        <div className="music-orb orb-two" />
        <div className="music-grid" />
      </div>

      <div className="music-content">
        <span className="section-label">{t("TOKYO / SOUNDTRACK")}</span>

        <h2>
          {t("wanna feel")}
          <br />
          <span>{t("tokyo?")}</span>
        </h2>

        <button className="music-play" onClick={onPlay} aria-label={t("Open the Tokyo soundtrack player")}>
          <span className="play-icon">{active ? "↗" : "▶"}</span>
          <span>{active ? t("OPEN PLAYER") : t("PLAY")}</span>
        </button>
      </div>
    </section>
  );
}

function MapboxExplorer() {
  const t = useCopy();
  const root = useRef(null);
  const container = useRef(null);
  const [isNearView, setIsNearView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [liveStreamIndex, setLiveStreamIndex] = useState(0);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const liveStreams = [
    {
      label: "SHIBUYA / LIVE CAMERA",
      title: "Live camera at Shibuya Crossing, Tokyo",
      src: "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&playsinline=1&controls=1&rel=0",
    },
    {
      label: "SHIBUYA / CAMERA 02",
      title: "Live camera 2 at Shibuya Scramble Crossing, Tokyo",
      src: "https://www.youtube.com/embed/8H3nRCFVR6Y?autoplay=1&mute=1&playsinline=1&controls=1&rel=0",
    },
    {
      label: "MT. FUJI / LIVE CAMERA",
      title: "Mount Fuji live camera from Lake Kawaguchiko Oishi Park",
      src: "https://www.youtube.com/embed/bdUbACCWmoY?autoplay=1&mute=1&playsinline=1&controls=1&rel=0",
    },
    {
      label: "KABUKICHO / LIVE CAMERA",
      title: "Live camera at Kabukicho, Shinjuku, Tokyo",
      src: "https://www.youtube.com/embed/gFRtAAmiFbE?autoplay=1&mute=1&playsinline=1&controls=1&rel=0",
    },
    {
      label: "TOKYO TOWER / LIVE CAMERA",
      title: "Live camera at Tokyo Tower",
      src: "https://www.youtube.com/embed/nu6NE55_X7A?list=PLsJX9jYnf4a0EoRn9P_R-5BbERIPtVVXJ&autoplay=1&mute=1&playsinline=1&controls=1&rel=0",
    },
  ];
  const liveStream = liveStreams[liveStreamIndex];

  useEffect(() => {
    if (!root.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearView(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!container.current || !token || !isNearView) return undefined;
    let disposed = false;
    let map;
    let popup;
    let markers = [];

    const initializeMap = async () => {
      try {
        const { default: mapboxgl } = await import("mapbox-gl");
        if (disposed || !container.current) return;

        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({
          container: container.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [139.75, 35.681],
          zoom: 11.2,
          pitch: 28,
          bearing: -12,
          attributionControl: false,
        });
        popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 22 });
        markers = wayfindingLocations.map((location) => {
          const element = document.createElement("button");
          const number = document.createElement("span");
          element.type = "button";
          element.className = "mapbox-marker";
          element.setAttribute("aria-label", `${t("Show")} ${t(location.name)}`);
          number.textContent = location.number;
          element.append(number);
          element.addEventListener("click", () => {
            setSelected(location);
            const content = document.createElement("div");
            content.className = "mapbox-popup-content";
            const title = document.createElement("strong");
            const district = document.createElement("span");
            const description = document.createElement("p");
            title.textContent = t(location.name);
            district.textContent = t(location.district);
            description.textContent = t(location.description);
            content.append(title, district, description);
            popup.setDOMContent(content).setLngLat(location.coordinates).addTo(map);
            map.flyTo({ center: location.coordinates, zoom: 13, duration: 700 });
          });
          return new mapboxgl.Marker({ element, anchor: "bottom" })
            .setLngLat(location.coordinates)
            .addTo(map);
        });
        map.on("error", () => setMapError(true));
      } catch {
        if (!disposed) setMapError(true);
      }
    };

    initializeMap();

    return () => {
      disposed = true;
      markers.forEach((marker) => marker.remove());
      popup?.remove();
      map?.remove();
    };
  }, [isNearView, token]);

  return (
    <div className="mapbox-explorer" ref={root}>
      <div className="mapbox-heading">
        <span>{t("LIVE MAP / TOKYO")}</span>
        <span>35°41′N 139°41′E</span>
      </div>
      {token ? (
        <div className="mapbox-frame">
          <div className="mapbox-canvas" ref={container} aria-label="Interactive map of Tokyo" />
          {mapError && <p className="mapbox-error" role="status">{t("Mapbox could not load. Check that your VITE_MAPBOX_TOKEN is valid.")}</p>}
          <div className="mapbox-attribution">Mapbox · OpenStreetMap</div>
        </div>
      ) : (
        <div className="mapbox-live-stream">
          <iframe
            key={liveStream.src}
            src={liveStream.src}
            title={t(liveStream.title)}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
          <span className="mapbox-live-label">{t(liveStream.label)}</span>
          <div className="mapbox-live-controls" aria-label={t("Change live camera")}>
            <button type="button" onClick={() => setLiveStreamIndex((index) => (index - 1 + liveStreams.length) % liveStreams.length)} aria-label={t("Previous live camera")}>←</button>
            <button type="button" onClick={() => setLiveStreamIndex((index) => (index + 1) % liveStreams.length)} aria-label={t("Next live camera")}>→</button>
          </div>
        </div>
      )}
      {token ? (
        <div className="mapbox-place-detail" aria-live="polite">
          <span>{selected ? t(selected.district) : t("FIVE PLACES / ONE CITY")}</span>
          <strong>{selected ? t(selected.name) : t("Choose a map marker")}</strong>
          <p>{selected ? t(selected.description) : t("Select a numbered marker to see what is nearby.")}</p>
        </div>
      ) : (
        <div className="mapbox-place-detail mapbox-place-detail--camera" aria-live="polite">
          <span>{t(liveStream.label)}</span>
        </div>
      )}
    </div>
  );
}

function RailwayMapModal({ onClose }) {
  const t = useCopy();
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="railway-modal" role="dialog" aria-modal="true" aria-label={t("Tokyo railway map")} onClick={onClose}>
      <button type="button" className="railway-modal-close" onClick={onClose} aria-label={t("Close railway map")}>×</button>
      <figure onClick={(event) => event.stopPropagation()}>
        <OptimizedImage src="https://www.genkimobile.com/wordpress/wp-content/uploads/2025/11/Tokyo-metro-map1.png" alt="Tokyo railway and metro network map" loading="lazy" sizes="(max-width: 850px) 100vw, 55vw" />
        <figcaption>{t("Tokyo railway and metro network")}</figcaption>
      </figure>
    </div>,
    document.body
  );
}

function Home({ onPlay, musicActive }) {
  const t = useCopy();
  const [railMapOpen, setRailMapOpen] = useState(false);
  const placesTrack = useRef(null);
  const scrollPlaces = (direction) => {
    const track = placesTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(track.clientWidth * 0.78, 300), behavior: "smooth" });
  };

  return (
    <>
      <SakuraEditorialPoster
        className="home-sakura-poster"
        height="280vh"
        title={t("TOKYO")}
        keywords={["Tokyo neighborhoods", "Street life", "Late trains"].map((label) => ({ label: t(label) }))}
        headline={t("A City of Many Sides | いろんなまちが、ひとつに。")}
        body={t("From the first train to the last glow of neon, Tokyo changes block by block. Take a crossing, a quiet garden, a narrow lane. The best route is the one that lets you wander.")}
        subheadline={t("Find your own pace in Tokyo.")}
        footerLeft={t("TOKYO, JAPAN")}
        footerCenter={t("CITY GUIDE / 01")}
        footerRight={t("35°39′N / 139°42′E")}
        socialHandle=""
        sceneAlt={t("Soft bokeh cherry blossoms background")}
        foregroundAlt={t("Cherry blossom branch in the foreground")}
      />

      <main>
        <section className="intro-section">

          <div className="intro-copy">
            <p className="giant-copy">
              {t("Tokyo is not one city.")}
              <br />
              <span>{t("It is thousands of them.")}</span>
            </p>

            <p className="intro-small">
              {t("A visual journey through the neighborhoods, streets, temples, food and quiet corners that make Tokyo impossible to experience in just one way.")}
            </p>
          </div>
        </section>

        <TokyoPhotoReel />

        <section className="places-section" id="places">
          <div className="section-heading">
            <span className="section-index">{t(`${String(places.length).padStart(2, "0")} PLACES`)}</span>
          </div>
          <div className="destinations-toolbar">
            <span>{t("TOKYO / PLACE GUIDE")}</span>
            <div className="destinations-controls">
              <button type="button" onClick={() => scrollPlaces(-1)} aria-label={t("Previous destinations")}>←</button>
              <button type="button" onClick={() => scrollPlaces(1)} aria-label={t("Next destinations")}>→</button>
            </div>
          </div>
          <div className="destinations-track" ref={placesTrack}>
            {places.map((place, index) => <Place key={place.name} place={place} index={index} />)}
          </div>
        </section>

        <section className="map-section" id="find-your-way">
          <div className="map-copy">

            <h2>
              {t("FIND YOUR")}
              <br />
              {t("WAY.")}
            </h2>

            <p>
              {t("The rail network makes Tokyo easy to explore. Use the railway map for the big picture, then find these places on the live city map.")}
            </p>

            <a className="text-link" href="/train">
              {t("TOKYO TRAIN GUIDE")} <span>↗</span>
            </a>
          </div>

          <div className="wayfinding-visuals">
            <div className="railway-map-panel">
              <div className="railway-map-heading">
                <span>{t("REFERENCE / RAIL NETWORK")}</span>
                <span>{t("TOKYO, JAPAN")}</span>
              </div>
              <button type="button" className="railway-map-button" onClick={() => setRailMapOpen(true)} aria-label={t("Open Tokyo railway map")}>
                <OptimizedImage src="https://www.genkimobile.com/wordpress/wp-content/uploads/2025/11/Tokyo-metro-map1.png" alt={t("Tokyo railway and metro network map")} loading="lazy" sizes="(max-width: 850px) 100vw, 55vw" />
                <span>{t("OPEN FULL MAP ↗")}</span>
              </button>
            </div>
            <MapboxExplorer />
          </div>
        </section>

        <MusicPrompt onPlay={onPlay} active={musicActive} />
      </main>

      {railMapOpen && <RailwayMapModal onClose={() => setRailMapOpen(false)} />}
      <Footer />
    </>
  );
}

const transportLines = [
  {
    id: "yamanote",
    code: "JY",
    operator: "JR EAST",
    name: "Yamanote Line",
    color: "#73a94b",
    fare: "JR East fares vary by distance; 2026 Tokyo starting fares are ¥150 inside the Yamanote loop and ¥160 on trunk-line areas.",
    stations: ["Shibuya", "Harajuku", "Shinjuku", "Ikebukuro", "Ueno", "Akihabara", "Tokyo", "Shinagawa"],
    coords: [[35.6580,139.7016],[35.6702,139.7027],[35.6896,139.7006],[35.7295,139.7109],[35.7138,139.7770],[35.6984,139.7731],[35.6812,139.7671],[35.6285,139.7387],[35.6580,139.7016]],
  },
  {
    id: "ginza",
    code: "G",
    operator: "TOKYO METRO",
    name: "Ginza Line",
    color: "#f0a400",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Omote-sando", "Ginza", "Nihombashi", "Ueno", "Asakusa"],
    coords: [[35.6580,139.7016],[35.6653,139.7120],[35.6717,139.7650],[35.6813,139.7739],[35.7138,139.7770],[35.7116,139.7967]],
  },
  {
    id: "asakusa",
    code: "A",
    operator: "TOEI SUBWAY",
    name: "Asakusa Line",
    color: "#e94b45",
    fare: "Toei Subway uses distance-based fares; the Tokyo Subway Ticket also covers this line.",
    stations: ["Nishi-magome", "Ginza", "Nihombashi", "Asakusa", "Oshiage"],
    coords: [[35.5868,139.7056],[35.6717,139.7650],[35.6813,139.7739],[35.7116,139.7967],[35.7101,139.8107]],
  },
  {
    id: "hibiya",
    code: "H",
    operator: "TOKYO METRO",
    name: "Hibiya Line",
    color: "#b5b5b5",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Naka-meguro", "Ebisu", "Roppongi", "Ginza", "Ueno", "Kita-senju"],
    coords: [[35.6440,139.6983],[35.6467,139.7101],[35.6628,139.7314],[35.6717,139.7650],[35.7138,139.7770],[35.7497,139.8050]],
  },
  {
    id: "marunouchi",
    code: "M",
    operator: "TOKYO METRO",
    name: "Marunouchi Line",
    color: "#d93a3a",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shinjuku", "Shinjuku-sanchome", "Tokyo", "Otemachi", "Ikebukuro"],
    coords: [[35.6896,139.7006],[35.6909,139.7067],[35.6812,139.7671],[35.6862,139.7636],[35.7295,139.7109]],
  },
  {
    id: "hanzomon",
    code: "Z",
    operator: "TOKYO METRO",
    name: "Hanzomon Line",
    color: "#8c6bb1",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Omote-sando", "Aoyama-itchome", "Nagatacho", "Oshiage"],
    coords: [[35.6580,139.7016],[35.6653,139.7120],[35.6720,139.7238],[35.6786,139.7380],[35.7101,139.8107]],
  },
  {
    id: "fukutoshin",
    code: "F",
    operator: "TOKYO METRO",
    name: "Fukutoshin Line",
    color: "#9a6b2f",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Meiji-jingumae", "Shinjuku-sanchome", "Ikebukuro"],
    coords: [[35.6580,139.7016],[35.6695,139.7053],[35.6909,139.7067],[35.7295,139.7109]],
  },
  {
    id: "oedo",
    code: "E",
    operator: "TOEI SUBWAY",
    name: "Oedo Line",
    color: "#9b2d8b",
    fare: "Toei Subway; useful for Roppongi, Shinjuku, Ueno-okachimachi and Ryogoku. Use the official fare planner for an exact station-to-station fare.",
    stations: ["Shinjuku", "Roppongi", "Ueno-okachimachi", "Ryogoku", "Tsukishima"],
    coords: [[35.6896,139.7006],[35.6628,139.7314],[35.7075,139.7748],[35.6963,139.7930],[35.6597,139.7794]],
  },
];

const stationPoints = [
  ["Shibuya",35.6580,139.7016], ["Harajuku",35.6702,139.7027], ["Shinjuku",35.6896,139.7006],
  ["Ikebukuro",35.7295,139.7109], ["Ueno",35.7138,139.7770], ["Akihabara",35.6984,139.7731],
  ["Tokyo",35.6812,139.7671], ["Ginza",35.6717,139.7650], ["Asakusa",35.7116,139.7967],
  ["Oshiage / Skytree",35.7101,139.8107], ["Meiji-jingumae",35.6695,139.7053], ["Daikanyama",35.6481,139.7036],
  ["Nihombashi",35.6813,139.7739], ["Roppongi",35.6628,139.7314],
  ["Shinagawa",35.6285,139.7387], ["Shimbashi",35.6663,139.7584],
  ["Odaiba",35.6298,139.7759], ["Maihama",35.6361,139.8805],
];

const stationDetails = {
  Shibuya: {
    codes: ["JR Yamanote JY20", "JR Saikyo JA10", "Ginza G01", "Hanzomon Z01", "Fukutoshin F16", "Tokyu Toyoko TY01", "Tokyu Den-en-toshi DT01", "Keio Inokashira IN01"],
    attractions: "Shibuya Scramble Crossing, Shibuya Sky, Hachiko Memorial Statue",
    usefulArea: "Use the Hachiko Exit for the Scramble Crossing.",
  },
  Shinjuku: {
    codes: ["JR Yamanote JY17", "JR Chuo Rapid JC05", "JR Chuo-Sobu JB10", "JR Saikyo JA11", "Marunouchi M08", "Toei Shinjuku S01", "Toei Oedo E27"],
    attractions: "Shinjuku Gyoen, Kabukicho, Tokyo Metropolitan Government Building",
    usefulArea: "Shinjuku Station is very large; follow the operator and exit signs for your destination.",
  },
  Harajuku: {
    codes: ["JR Yamanote JY19", "Fukutoshin F15 (Meiji-jingumae)"],
    attractions: "Meiji Jingu, Takeshita Street, Omotesando",
    usefulArea: "Meiji-jingumae is a separate nearby station served by Tokyo Metro.",
  },
  Tokyo: {
    codes: ["JR Yamanote JY01", "JR Chuo Rapid JC01", "JR Tokaido JT01", "JR Ueno-Tokyo JU01", "Marunouchi M17"],
    attractions: "Tokyo Station Marunouchi Building, Imperial Palace East Gardens",
    usefulArea: "Use the Marunouchi side for the historic station building and the Yaesu side for many Shinkansen gates.",
  },
  Ueno: {
    codes: ["JR Yamanote JY05", "JR Keihin-Tohoku JK30", "JR Joban Rapid JJ01", "Ginza G16", "Hibiya H17"],
    attractions: "Ueno Park, Tokyo National Museum, Ameyoko",
    usefulArea: "Ueno Park and museums are on the Park side of the JR station.",
  },
  Ikebukuro: {
    codes: ["JR Yamanote JY13", "JR Saikyo JA12", "Marunouchi M25", "Fukutoshin F09", "Seibu Ikebukuro SI01", "Tobu Tojo TJ01"],
    attractions: "Sunshine City, Ikebukuro shopping district",
    usefulArea: "The station has several operators; check the operator name before entering a gate.",
  },
  Shinagawa: {
    codes: ["JR Yamanote JY25", "JR Keihin-Tohoku JK20", "JR Tokaido JT03", "JR Yokosuka JO17", "Keikyu KK01"],
    attractions: "Shinagawa Station area, Takanawa Gateway",
    usefulArea: "Keikyu platforms connect the station area with Haneda Airport services.",
  },
  Akihabara: {
    codes: ["JR Yamanote JY03", "JR Keihin-Tohoku JK28", "JR Chuo-Sobu JB19", "Hibiya H16"],
    attractions: "Akihabara Electric Town, Kanda Myojin",
    usefulArea: "Use the Electric Town Exit for the main electronics and anime shopping streets.",
  },
  Ginza: {
    codes: ["Ginza G09", "Marunouchi M16", "Hibiya H09", "Asakusa A11 (Higashi-ginza)"],
    attractions: "Ginza shopping district, Kabukiza Theatre",
    usefulArea: "Ginza and Higashi-ginza are connected by underground passages but are separate stations.",
  },
  Asakusa: {
    codes: ["Ginza G19", "Toei Asakusa A18", "Tobu Skytree TS01"],
    attractions: "Senso-ji, Kaminarimon, Nakamise Street",
    usefulArea: "Follow signs for Kaminarimon and Senso-ji; several operators have separate gates.",
  },
  Roppongi: {
    codes: ["Hibiya H04", "Toei Oedo E23"],
    attractions: "Roppongi Hills, Mori Art Museum, Tokyo Midtown",
    usefulArea: "Roppongi Hills and Tokyo Midtown are in different directions from the station.",
  },
  Shimbashi: {
    codes: ["JR Yamanote JY29", "JR Keihin-Tohoku JK24", "Ginza G08", "Toei Asakusa A10", "Yurikamome U01"],
    attractions: "Shiodome, Hamarikyu Gardens, gateway to Odaiba",
    usefulArea: "Yurikamome has its own station and gate area; follow the dedicated signs.",
  },
  Odaiba: {
    codes: ["Yurikamome Daiba U07", "Rinkai Tokyo Teleport R04 (nearby)"],
    attractions: "Odaiba Seaside Park, waterfront museums and shopping",
    usefulArea: "Odaiba has several stations; choose the one closest to your destination.",
  },
  Maihama: {
    codes: ["JR Keiyo JE07"],
    attractions: "Tokyo Disney Resort",
    usefulArea: "Follow the resort signs from the south side of the station.",
  },
  "Oshiage / Skytree": {
    codes: ["Hanzomon Z14", "Toei Asakusa A20", "Tobu Skytree TS30"],
    attractions: "Tokyo Skytree, Tokyo Solamachi",
    usefulArea: "Oshiage is the station name for Tokyo Skytree; follow the Skytree exit signs.",
  },
};

const railwayDirectory = [
  {
    operator: "JR EAST",
    type: "JR / urban and regional rail",
    lines: [
      { name: "Yamanote Line", code: "JY", color: "#80c241", corridor: "Tokyo's circular line; Shinjuku, Shibuya, Harajuku, Tokyo, Ueno and Ikebukuro.", mapId: "yamanote" },
      { name: "Chuo Rapid Line", code: "JC", color: "#f15a22", corridor: "Tokyo–Shinjuku–Tachikawa–Hachioji; faster service with fewer stops than the local service." },
      { name: "Chuo-Sobu Local Line", code: "JB", color: "#ffd400", corridor: "Local service through Shinjuku, Akihabara and onward toward Chiba; stops more frequently than the Chuo Rapid." },
      { name: "Keihin-Tohoku Line", code: "JK", color: "#00b2e5", corridor: "Omiya–Ueno–Tokyo–Shinagawa–Yokohama corridor." },
      { name: "Saikyo Line", code: "JA", color: "#00ac9a", corridor: "Omiya–Ikebukuro–Shinjuku–Shibuya–Osaki corridor." },
      { name: "Shonan-Shinjuku Line", code: "JS", color: "#e73848", corridor: "Through service linking the Shinjuku area with destinations in the north and south." },
      { name: "Yokosuka Line", code: "JO", color: "#007ac0", corridor: "Tokyo–Shinagawa and through service toward Yokosuka." },
      { name: "Sobu Rapid Line", code: "JO", color: "#007ac0", corridor: "Tokyo–Chiba rapid service; shares the JO station-code family with Yokosuka services." },
      { name: "Tokaido Line", code: "JT", color: "#f68b1e", corridor: "Tokyo–Shinagawa and onward toward Yokohama and the Tokaido corridor." },
      { name: "Keiyo Line", code: "JE", color: "#c9252f", corridor: "Tokyo–Maihama (Tokyo Disney Resort)–Soga." },
      { name: "Musashino Line", code: "JM", color: "#e85298", corridor: "Suburban orbital service connecting western and eastern Tokyo-area railways." },
      { name: "Ueno-Tokyo Line", code: "JU", color: "#f68b1e", corridor: "Through service connecting Ueno with Tokyo Station and southern lines." },
      { name: "Joban Rapid Line", code: "JJ", color: "#00b261", corridor: "Ueno–Matsudo–Abiko–Toride corridor." },
      { name: "Joban Local Line", code: "JL", color: "#80c89b", corridor: "Local service through the northern Tokyo suburbs, including Matsudo and Abiko." },
      { name: "Yokohama Line", code: "JH", color: "#7bb8d2", corridor: "Higashi-Kanagawa–Shin-Yokohama–Hachioji." },
      { name: "Nambu Line", code: "JN", color: "#ffd400", corridor: "Kawasaki–Musashi-Kosugi–Tachikawa." },
    ],
  },
  {
    operator: "TOKYO METRO",
    type: "Subway / nine lines",
    lines: [
      { name: "Ginza Line", code: "G", color: "#f39700", corridor: "Shibuya–Ginza–Ueno–Asakusa.", mapId: "ginza" },
      { name: "Marunouchi Line", code: "M", color: "#e60012", corridor: "Ikebukuro–Tokyo–Shinjuku.", mapId: "marunouchi" },
      { name: "Hibiya Line", code: "H", color: "#9caeb7", corridor: "Naka-meguro–Roppongi–Ginza–Ueno.", mapId: "hibiya" },
      { name: "Tozai Line", code: "T", color: "#00a7db", corridor: "Nakano–Otemachi–Nishi-funabashi." },
      { name: "Chiyoda Line", code: "C", color: "#00bb85", corridor: "Yoyogi-uehara–Omotesando–Otemachi–Kita-ayase." },
      { name: "Yurakucho Line", code: "Y", color: "#c1a470", corridor: "Wakoshi–Ikebukuro–Yurakucho–Shin-kiba." },
      { name: "Hanzomon Line", code: "Z", color: "#8f76d6", corridor: "Shibuya–Otemachi–Oshiage.", mapId: "hanzomon" },
      { name: "Namboku Line", code: "N", color: "#00ada9", corridor: "Meguro–Nagatacho–Akabane-iwabuchi." },
      { name: "Fukutoshin Line", code: "F", color: "#9c5e31", corridor: "Shibuya–Shinjuku-sanchome–Ikebukuro.", mapId: "fukutoshin" },
    ],
  },
  {
    operator: "TOEI SUBWAY",
    type: "Subway / four lines",
    lines: [
      { name: "Asakusa Line", code: "A", color: "#e85298", corridor: "Nishi-magome–Shimbashi–Asakusa–Oshiage.", mapId: "asakusa" },
      { name: "Mita Line", code: "I", color: "#0079c2", corridor: "Meguro–Hibiya–Otemachi–Nishi-takashimadaira." },
      { name: "Shinjuku Line", code: "S", color: "#6cbb5a", corridor: "Shinjuku–Jimbocho–Motoyawata." },
      { name: "Oedo Line", code: "E", color: "#b6007a", corridor: "Looping route serving Shinjuku, Roppongi, Tsukiji and Ueno-okachimachi.", mapId: "oedo" },
    ],
  },
  {
    operator: "PRIVATE RAILWAYS & SPECIAL TRANSIT",
    type: "Regular rail, airport links and special transit",
    lines: [
      { name: "Odakyu Odawara Line", corridor: "Shinjuku–Odawara; access toward Hakone and other western destinations." },
      { name: "Keio Line", corridor: "Shinjuku–Keio-hachioji." },
      { name: "Keio Inokashira Line", corridor: "Shibuya–Kichijoji." },
      { name: "Seibu Shinjuku Line", corridor: "Seibu-shinjuku–Hon-kawagoe." },
      { name: "Seibu Ikebukuro Line", corridor: "Ikebukuro–Chichibu / western suburban destinations." },
      { name: "Tobu Skytree Line", corridor: "Asakusa / Oshiage–Tobu-dobutsu-koen and beyond." },
      { name: "Tobu Tojo Line", corridor: "Ikebukuro–Kawagoe / Saitama destinations." },
      { name: "Tokyu Toyoko Line", corridor: "Shibuya–Yokohama; through services connect with the Fukutoshin Line." },
      { name: "Tokyu Den-en-toshi Line", corridor: "Shibuya–western suburbs; through services connect with the Hanzomon Line." },
      { name: "Keikyu Line", corridor: "Shinagawa–Haneda Airport and Yokohama directions." },
      { name: "Keisei Line", corridor: "Keisei-ueno / Nippori–Narita Airport and Chiba." },
      { name: "Tsukuba Express", corridor: "Akihabara–Tsukuba." },
      { name: "Rinkai Line", corridor: "Shin-kiba–Tokyo Teleport / Odaiba–Osaki." },
      { name: "Yurikamome Line", corridor: "Shimbashi–Odaiba–Toyosu; automated elevated transit." },
      { name: "Tokyo Monorail", corridor: "Hamamatsucho–Haneda Airport; airport monorail." },
      { name: "Nippori-Toneri Liner", corridor: "Nippori–Minumadai-shinsuikōen; automated transit." },
      { name: "Tokyo Sakura Tram (Toden Arakawa Line)", corridor: "Waseda–Minowabashi; street-running tram." },
    ],
  },
];

const airportServices = [
  { airport: "NARITA AIRPORT", services: [
    { name: "Narita Express (N'EX)", route: "JR service to major terminals including Tokyo, Shinagawa, Shibuya and Shinjuku; check the current train pattern and reservation requirements." },
    { name: "Keisei Skyliner", route: "Limited Express service between Narita Airport and Keisei-Ueno / Nippori; reserved seating and separate ticket." },
    { name: "Keisei Access Express", route: "Through services may continue onto the Toei Asakusa Line and other lines; destination varies by service." },
  ] },
  { airport: "HANEDA AIRPORT", services: [
    { name: "Keikyu Airport Line", route: "Connects the airport with Shinagawa and offers through services; confirm the destination shown on the train." },
    { name: "Tokyo Monorail", route: "Connects the airport with Hamamatsucho, where JR Yamanote and Keihin-Tohoku services are available." },
  ] },
];

const visitorGuides = [
  { title: "IC Cards", items: [
    "Suica and PASMO are rechargeable IC cards used on most participating JR, subway and private railway services, plus many buses and shops.",
    "Buy or charge a card at a station ticket machine or service counter where available. Mobile card options depend on your device and region.",
    "Tap once at the entry gate and tap again at the exit gate. Use the same card throughout the trip and keep it ready at the gate.",
  ] },
  { title: "Understanding stations", items: [
    "Station codes combine a line letter with a station number, such as JY20 or G01. Check the code and station name together.",
    "Line colors help identify a route, but always confirm the operator, line name and destination on signs and platform displays.",
    "Platform signs show destinations and train types. Check the direction and stopping pattern before boarding.",
  ] },
  { title: "Train types", items: [
    "Local trains stop at every station on their route.",
    "Rapid and express services skip some stations. Limited Express trains may require a separate limited-express ticket or seat reservation.",
    "Always check the station's stopping pattern; not every train stops at every station.",
  ] },
  { title: "Transfers", items: [
    "JR, Tokyo Metro, Toei and private railways are separate operators. Follow signs for the exact line and operator when transferring.",
    "Look for transfer signs and line colors. Some transfers require exiting one fare area or walking between nearby station buildings.",
    "When using an IC card, follow the transfer gates and signs so your fare is recorded correctly.",
  ] },
  { title: "Train etiquette", items: [
    "Queue behind the marked lines, let passengers exit first, and keep doorways clear.",
    "Keep conversations quiet, avoid phone calls, and keep luggage close without blocking seats or aisles.",
    "Follow each station's escalator guidance; local customs vary by area and can change during busy periods.",
  ] },
  { title: "Last trains", items: [
    "Tokyo trains do not run 24 hours. Check the last departure for your exact route before going out, especially late at night.",
    "Service times, platforms and disruptions change. Use an official operator planner or Google Maps Transit for current journey planning.",
  ] },
];

const touristRoutes = [
  ["Shinjuku", "Shibuya", "JR Yamanote Line toward Shibuya / Shinagawa is a simple example; confirm the platform display."],
  ["Shinjuku", "Harajuku", "JR Yamanote Line; check the platform direction and current service."],
  ["Shinjuku", "Tokyo", "JR Chuo Rapid Line is a common direct option; confirm the departure board."],
  ["Shinjuku", "Asakusa", "Several transfers are possible; use a live planner for the best current route."],
  ["Shinjuku", "Akihabara", "JR Chuo-Sobu Local Line is one direct option; check the platform and direction."],
  ["Shibuya", "Tokyo Tower", "Use a live planner for the nearest station and walking approach to your chosen tower entrance."],
  ["Shinjuku", "Ueno", "JR Yamanote Line is a common direct option; confirm the direction on the platform."],
  ["Tokyo", "Maihama", "JR Keiyo Line serves Maihama for Tokyo Disney Resort; allow time to walk to the Keiyo platforms."],
  ["Shinjuku", "Narita Airport", "Compare Narita Express and other current airport services using a live planner."],
  ["Shinjuku", "Haneda Airport", "Compare current JR / Keikyu or monorail connections using a live planner."],
];

const transportTips = [
  ["IC FIRST", "For most visitors, a rechargeable IC card is the easiest default. Tap in, ride, tap out. Suica/PASMO work across participating trains and buses, and can also be used at participating shops and vending machines."],
  ["TRANSFER", "Tokyo has multiple operators. A JR station and a Tokyo Metro station can be physically close but use different fare systems. Follow the operator and line color shown on the signs."],
  ["LAST TRAINS", "Do not assume trains run all night. Check the last-train time for your exact route, especially after nightlife in Shibuya or Shinjuku."],
  ["PLATFORM", "Stand behind the marked line, let passengers exit first, and keep doorways clear. Keep voices low on commuter trains."],
  ["BUS", "Toei buses in Tokyo's 23 wards generally use a flat ¥210 adult fare (¥210 IC). Tap your IC card at the reader and follow the stop display/announcement."],
  ["LUGGAGE", "Large stations can involve long walks and stairs. Use station elevators where available and consider lockers before exploring with heavy bags."],
  ["PAYMENT", "Tokyo Metro supports contactless Tap to Ride on all Metro lines for supported cards; acceptance is operator-specific, so an IC card remains the simplest all-network backup."],
  ["MAPS", "Use a live route planner for the exact platform, transfer path and last train. The map on this site is a visual network explorer, not a timetable."],
];

const shoppingGuide = [
  { area: "HARAJUKU", focus: "SNEAKERS / STREETWEAR / VINTAGE", text: "Start around Jingumae, Takeshita Street and Cat Street. This is the easiest cluster for sneaker hunting, streetwear and vintage.", image: "https://omoharareal.com/image/area/188753bc7e573462628e_l.jpeg", stores: [{ name: "atmos Harajuku", note: "Sneaker-focused store in Jingumae." }, { name: "KICKS LAB. Harajuku", note: "Sneaker specialist in Jingumae." }, { name: "SNKRDUNK HARAJUKU", note: "Sneakers and streetwear in Harajuku." }, { name: "NUIR VINTAGE HARAJUKU", note: "Vintage clothing in Jingumae." }, { name: "QOO", note: "Vintage clothing around Jingumae." }] },
  { area: "SHIBUYA", focus: "FASHION / STREETWEAR / LIFESTYLE", text: "Shibuya has large commercial complexes plus independent stores. Shibuya PARCO, Jinnan and the streets toward Aoyama are useful for fashion and lifestyle shopping.", image: "https://image.parco.jp/SCCWEB/image/shibuya/store/storage/w1580xh1020/shop_cname_20200725095305.jpg", stores: [{ name: "Shibuya Parco", note: "Large multi-floor shopping destination in Shibuya." }, { name: "BEAMS JAPAN SHIBUYA", note: "Japanese fashion and lifestyle selection." }] },
  { area: "DAIKANYAMA", focus: "JAPANESE BRANDS / DESIGN / VINTAGE", text: "Quieter than Shibuya, with independent boutiques and Japanese labels around Daikanyama and Sarugakucho.", image: "https://images.pexels.com/photos/29241321/pexels-photo-29241321.jpeg?cs=srgb&fm=jpg", stores: [{ name: "Okura", note: "Japanese clothing store in Sarugakucho." }] },
  { area: "ASAKUSA", focus: "CRAFTS / SOUVENIRS / KITCHEN", text: "Nakamise and the surrounding streets are good for traditional goods. Kappabashi nearby is especially useful for kitchenware.", image: "https://static1.squarespace.com/static/5d3ee66abacfa00001df6854/t/5f069ed2fa5c672f37a92656/1594345760363/tokyo-private-tour-nakamise-shopping-street.jpeg?format=1500w", stores: [{ name: "Nakamise Shopping Street", note: "Traditional souvenirs, snacks and craft shops near Senso-ji." }, { name: "Kappabashi Kitchen Town", note: "Specialty kitchenware, tableware and restaurant supplies." }] },
  { area: "AKIHABARA", focus: "ELECTRONICS / CAMERAS / TECH", text: "A practical stop for electronics, cameras, accessories and stationery. Large retailers cluster around the station.", image: "https://upload.wikimedia.org/wikipedia/commons/6/60/Sotokanda%2C_Akihabara_Electric_Town_at_night_20231114.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original", stores: [{ name: "Yodobashi Camera Multimedia Akiba", note: "Large electronics, camera and travel essentials store beside Akihabara Station." }, { name: "Animate Akihabara", note: "Multi-floor anime, manga and character goods." }, { name: "Super Potato Akihabara", note: "Retro games, consoles and collectibles." }] },
  { area: "GINZA", focus: "FLAGSHIPS / DEPARTMENT STORES / LUXURY", text: "Best for major department stores, flagships and higher-end Japanese and international brands.", image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Ginza-WAKO_at_night.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original", stores: [{ name: "GINZA SIX", note: "Luxury fashion, lifestyle shops and dining in central Ginza." }, { name: "Ginza Mitsukoshi", note: "Department store with fashion, homeware and food floors." }, { name: "UNIQLO Ginza", note: "Flagship store with a wide range of Japanese casualwear." }] },
];

function TrainMap({ activeLine, activeOperator, selectedStation, onSelectStation, onSelectLine, resetKey }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const callbacks = useRef({});
  callbacks.current = { onSelectStation, onSelectLine };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: true }).setView([35.683,139.748], 12.2);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    stationPoints.forEach(([name, lat, lng]) => {
      const code = stationDetails[name]?.codes?.[0];
      L.circleMarker([lat,lng], { radius: 6, color: "#101018", weight: 2, fillColor: "#fff", fillOpacity: 1 })
        .bindTooltip(code ? `${name} · ${code}` : name, { direction: "top", offset: [0,-6] })
        .on("click", () => callbacks.current.onSelectStation(name))
        .addTo(map);
    });
    mapInstance.current = map;
    window.setTimeout(() => map.invalidateSize(), 0);
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const layers = [];
    transportLines.forEach((line) => {
      if (activeOperator !== "ALL" && activeOperator !== line.operator) return;
      if (activeLine !== "ALL" && activeLine !== line.id) return;
      const layer = L.polyline(line.coords, {
        color: line.color,
        weight: activeLine === line.id ? 7 : 4,
        opacity: activeLine === line.id ? 0.98 : 0.76,
        lineJoin: "round",
      }).addTo(map);
      layer.on("click", () => callbacks.current.onSelectLine(line.id));
      layers.push(layer);
    });
    return () => layers.forEach((layer) => map.removeLayer(layer));
  }, [activeLine, activeOperator]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const point = stationPoints.find(([name]) => name === selectedStation);
    if (point) map.panTo([point[1], point[2]]);
  }, [selectedStation]);

  useEffect(() => {
    const map = mapInstance.current;
    if (map && resetKey > 0) map.setView([35.683,139.748], 12.2);
  }, [resetKey]);

  return <div className="transport-map" ref={mapRef} />;
}

const routePlaces = ["Shinjuku", "Shibuya", "Harajuku", "Tokyo", "Ueno", "Ikebukuro", "Shinagawa", "Akihabara", "Ginza", "Asakusa", "Roppongi", "Shimbashi", "Odaiba", "Maihama", "Tokyo Tower", "Narita Airport", "Haneda Airport"];

const routeMatrix = {
  "Shibuya|Asakusa": { fare: "¥252", time: "33 min", route: "Tokyo Metro Ginza Line · direct", note: "Current adult IC fare published by Tokyo Metro for Shibuya → Asakusa. Paper ticket is ¥260.", operator: "TOKYO METRO" },
  "Shibuya|Meiji Jingu": { fare: "¥0", time: "15–20 min walk", route: "Walk via Harajuku / Meiji-dori", note: "The shrine is walkable from Shibuya; no train fare is required for this route.", operator: "WALK" },
  "Shibuya|Daikanyama": { fare: "¥140", time: "2–4 min", route: "Tokyu Toyoko Line · 1 stop", note: "Current published one-stop fare between Shibuya and Daikanyama is ¥140 IC.", operator: "TOKYU" },
  "Shibuya|Tokyo Skytree": { fare: "¥252", time: "31 min", route: "Tokyo Metro Hanzomon Line · direct to Oshiage", note: "Use Oshiage <SKYTREE> for Tokyo Skytree. Tokyo Metro lists ¥252 IC on the Shibuya–Oshiage section.", operator: "TOKYO METRO" },
  "Asakusa|Meiji Jingu": { fare: "¥252", time: "~35–40 min", route: "Ginza Line to Omote-sando + walk", note: "A practical Metro route is Asakusa → Omote-sando, then walk toward Meiji Jingu / Harajuku.", operator: "TOKYO METRO" },
  "Asakusa|Daikanyama": { fare: "¥392", time: "~40–45 min", route: "Ginza Line to Shibuya + Toyoko Line", note: "Calculated from the published ¥252 Asakusa–Shibuya IC fare plus ¥140 Shibuya–Daikanyama IC fare.", operator: "METRO + TOKYU" },
  "Asakusa|Tokyo Skytree": { fare: "¥178", time: "~3–8 min", route: "Toei Asakusa Line · direct", note: "Oshiage is two stops from Asakusa; the current Toei fare is ¥178 IC / ¥180 ticket.", operator: "TOEI" },
  "Meiji Jingu|Daikanyama": { fare: "¥140", time: "~15–20 min", route: "Walk to Shibuya + Toyoko Line", note: "The estimate uses a walk from the shrine area to Shibuya, then the published ¥140 Shibuya–Daikanyama fare.", operator: "WALK + TOKYU" },
  "Meiji Jingu|Tokyo Skytree": { fare: "¥461", time: "~40–50 min", route: "Walk to Omote-sando + Metro via Hanzomon", note: "Estimate based on Metro segments; use the live planner for the exact station entrance and service at your departure time.", operator: "TOKYO METRO" },
  "Daikanyama|Tokyo Skytree": { fare: "¥392", time: "~35–45 min", route: "Toyoko Line to Shibuya + Hanzomon Line", note: "Calculated from ¥140 Daikanyama–Shibuya plus ¥252 Shibuya–Oshiage IC fares.", operator: "TOKYU + METRO" },
};

const featuredRoutes = [
  { from: "Shibuya", to: "Asakusa", fare: 252, route: "Ginza Line · 33 min", operator: "TOKYO METRO" },
  { from: "Shibuya", to: "Daikanyama", fare: 140, route: "Toyoko Line · 2–4 min", operator: "TOKYU" },
  { from: "Shibuya", to: "Tokyo Skytree", fare: 252, route: "Hanzomon Line · 31 min", operator: "TOKYO METRO" },
  { from: "Asakusa", to: "Tokyo Skytree", fare: 178, route: "Toei Asakusa Line · 3–8 min", operator: "TOEI" },
];

function normalizeRoute(a, b) {
  if (a === b) return { fare: "¥0", time: "0 min", route: "Same station", note: "Choose two different stations for a route estimate.", operator: "—" };
  const direct = routeMatrix[`${a}|${b}`];
  if (direct) return direct;
  const reverse = routeMatrix[`${b}|${a}`];
  if (reverse) return reverse;
  return { fare: "LIVE", time: "—", route: "Use live route planner", note: "This pair is not hard-coded because routes, operators and transfers can vary. Open Google Maps for the current result.", operator: "LIVE" };
}

function FareTabContent({ operator, amount, description }) {
  return (
    <div className="fare-tab-content">
      <div className="fare-tab-content__amount">
        <small>{operator} / ADULT FARE</small>
        <strong>{amount}</strong>
      </div>
      <p className="fare-tab-content__description">{description}</p>
    </div>
  );
}

function PlacesToGoSection() {
  const t = useCopy();
  const slides = places.slice(0, 6).map((place) => ({
    src: place.image,
    alt: t(place.name),
    title: t(place.name),
    subtitle: t(place.description),
    meta: [
      { label: t("AREA"), value: t(place.area) },
      { label: t("BEST TIME"), value: t(place.hours) },
    ],
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery ?? `${place.name}, Tokyo, Japan`)}`,
  }));

  return (
    <section className="places-to-go-section" id="places-to-go">
      <div className="places-to-go-section__heading">
        <h2>{t("PLACES TO GO")}<br /><span>{t("IN TOKYO.")}</span></h2>
        <p>{t("Six city stops, from the bright crossing to a quiet shrine forest.")}</p>
      </div>
      <CoverflowCarousel
        slides={slides}
        cardWidth="clamp(180px, 26vw, 320px)"
        rotate={42}
        depth={0.58}
        gap={0.05}
        showCaption
        showPagination
        showNavigation
        label={t("Places to go in Tokyo")}
      />
    </section>
  );
}

function ShoppingGuideSection() {
  const t = useCopy();
  const [selectedArea, setSelectedArea] = useState(null);
  const selectedShoppingArea = shoppingGuide.find((item) => item.area === selectedArea);

  useEffect(() => {
    if (!selectedShoppingArea) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedArea(null);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedShoppingArea]);

  return (
    <section className="shopping-section things-shopping" id="shopping">
      <div className="shopping-carousel-heading">
        <h2>{t("BUY WHAT")}<br /><span>{t("YOU CAME FOR.")}</span></h2>
        <p className="shopping-lead">{t("Tokyo's shopping districts have different personalities. Harajuku is strong for street fashion and sneakers, Shibuya for fashion and lifestyle, Daikanyama for quieter Japanese design, Asakusa for traditional goods and kitchenware, Akihabara for electronics, and Ginza for flagships and department stores.")}</p>
      </div>
      <ProgressSlider activeSlider={shoppingGuide[0].area} className="shopping-progressive-carousel">
        <SliderContent>
          {shoppingGuide.map((item, index) => (
            <SliderWrapper key={item.area} value={item.area}>
              <OptimizedImage className="progressive-carousel__image" src={item.image} alt={`${t(item.area)} shopping district`} loading={index === 0 ? "eager" : "lazy"} priority={index === 0} sizes="(max-width: 850px) 100vw, 80vw" />
              <div className="progressive-carousel__shade" aria-hidden="true" />
              <div className="progressive-carousel__slide-copy">
                <span>{t(item.area)}</span>
                <h3>{t(item.focus)}</h3>
                <p>{t(item.text)}</p>
              </div>
            </SliderWrapper>
          ))}
        </SliderContent>
        <SliderBtnGroup>
          {shoppingGuide.map((item) => (
            <SliderBtn key={item.area} value={item.area} onSelect={setSelectedArea}>
              <strong>{t(item.area)}</strong>
              <p>{t(item.focus)}</p>
            </SliderBtn>
          ))}
        </SliderBtnGroup>
      </ProgressSlider>

      {selectedShoppingArea && createPortal(
        <div className="shopping-store-modal" role="dialog" aria-modal="true" aria-labelledby="shopping-store-modal-title" onClick={() => setSelectedArea(null)}>
          <section className="shopping-store-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button className="shopping-store-modal-close" type="button" onClick={() => setSelectedArea(null)} aria-label={t("Close store list")}>×</button>
            <span className="shopping-store-modal-kicker">{t("STORES IN")} {t(selectedShoppingArea.area)}</span>
            <h2 id="shopping-store-modal-title">{t(selectedShoppingArea.area)}</h2>
            <p className="shopping-store-modal-focus">{t(selectedShoppingArea.focus)}</p>
            <ul className="shopping-store-list">
              {selectedShoppingArea.stores.map((store) => (
                <li key={store.name}>
                  <div className="shopping-store-list-heading">
                    <strong>{t(store.name)}</strong>
                    <a className="shopping-store-location" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${selectedShoppingArea.area}, Tokyo, Japan`)}`} target="_blank" rel="noopener noreferrer">
                      {t("SEE LOCATION")} ↗
                    </a>
                  </div>
                  <p>{t(store.note)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>,
        document.body,
      )}

    </section>
  );
}

function Train() {
  return <TrainGuide />;
}

function TrainDetails() {
  const t = useCopy();
  const [activeLine, setActiveLine] = useState("ALL");
  const [from, setFrom] = useState("Shibuya");
  const [to, setTo] = useState("Asakusa");
  const selectedLine = transportLines.find((line) => line.id === activeLine);
  const routeInfo = { ...normalizeRoute(from, to), maps: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from + " Station, Tokyo")}&destination=${encodeURIComponent(to + " Station, Tokyo")}&travelmode=transit` };

  return (
    <>
      <section className="transport-hero transport-hero-photo train-hero">
        <OptimizedImage className="transport-hero-image" src="https://images.pexels.com/photos/31385056/pexels-photo-31385056.jpeg?cs=srgb&fm=jpg" alt="Japanese train station in Tokyo" priority sizes="100vw" referrerPolicy="no-referrer" />
        <div className="transport-hero-overlay" />
        <div className="transport-hero-copy">
          <span className="section-label">{t("TOKYO / TRANSPORT")}</span>
          <h1>{t("GET AROUND")}<br /><span>{t("TOKYO.")}</span></h1>
          <p>{t("Train lines, fares, passes and the simplest way to move around Tokyo.")}</p>
        </div>
      </section>

      <main className="transport-page train-clean-page">
        <section className="transport-intro train-clean-intro">
          <div><h2>{t("KNOW")}<br /><span>{t("THE LINES.")}</span></h2><p>{t("JR East, Tokyo Metro, Toei Subway and private railways operate separate networks. The map below is a tourist-focused visual guide, not a live timetable.")}</p></div>
        </section>

        <section className="transport-map-section train-clean-map">
          <div className="transport-map-copy">
            <h2>{t("FOLLOW")}<br /><span>{t("THE LINES.")}</span></h2>
            <div className="line-picker">
              <button type="button" className={activeLine === "ALL" ? "active" : ""} onClick={() => setActiveLine("ALL")}>{t("ALL LINES")}</button>
              {transportLines.map((line) => <button type="button" key={line.id} className={activeLine === line.id ? "active" : ""} style={{ "--line-color": line.color }} onClick={() => setActiveLine(line.id)}><i style={{ background: line.color }} />{t(line.name)}</button>)}
            </div>
            {selectedLine && <div className="selected-line" style={{ "--line-color": selectedLine.color }}><span>{t(selectedLine.operator)}</span><strong>{t(selectedLine.name)}</strong><p>{t(selectedLine.fare)}</p></div>}
          </div>
          <TrainMap activeLine={activeLine} />
        </section>

        <section className="fare-section train-clean-section">
          <h2>{t("KNOW THE")}<br /><span>{t("PRICE.")}</span></h2>
          <AnimatedTabs
            ariaLabel={t("Tokyo fare options")}
            defaultTab="jr-east"
            tabs={[
              {
                id: "jr-east",
                label: t("JR EAST"),
                content: <FareTabContent operator={t("JR EAST")} amount="¥150+" description={t("JR East fares vary by distance and area. Exact journey fares should be checked for the stations you use.")} note={t("Adult fares vary by route. Check the fare for your exact stations before travel.")} />,
              },
              {
                id: "tokyo-metro",
                label: t("TOKYO METRO"),
                content: <FareTabContent operator={t("TOKYO METRO")} amount="¥178–¥324" description={t("Current adult IC fares vary by distance. Paper tickets use a separate fare table.")} note={t("Metro fares shown are adult IC fares; paper ticket prices differ.")} />,
              },
              {
                id: "toei-bus",
                label: t("TOEI BUS"),
                content: <FareTabContent operator={t("TOEI BUS")} amount="¥210" description={t("General adult fare in Tokyo's 23 wards. Some special services differ.")} note={t("Flat adult fare for most Toei bus services in central Tokyo.")} />,
              },
              {
                id: "metro-24h",
                label: t("METRO 24H"),
                content: <FareTabContent operator={t("METRO 24H")} amount="¥700" description={t("Unlimited rides on Tokyo Metro for 24 hours from first use.")} note={t("Valid on Tokyo Metro only; Toei Subway and JR are not included.")} />,
              },
            ]}
          />
        </section>

        <section className="route-planner train-clean-section">
          <h2>{t("FROM HERE.")}<br /><span>{t("TO THERE.")}</span></h2>
          <div className="route-controls">
            <label>{t("FROM")}<select value={from} onChange={(e) => setFrom(e.target.value)}>{routePlaces.map((place) => <option key={place} value={place}>{t(place)}</option>)}</select></label>
            <span className="route-arrow">→</span>
            <label>{t("TO")}<select value={to} onChange={(e) => setTo(e.target.value)}>{routePlaces.map((place) => <option key={place} value={place}>{t(place)}</option>)}</select></label>
          </div>
          <div className="route-result">
            <div><span>{t("IC FARE ESTIMATE")}</span><strong>{routeInfo.fare}</strong></div>
            <div><span>{t("TIME")}</span><b>{t(routeInfo.time)}</b></div>
            <div><span>{t("ROUTE")}</span><b>{t(routeInfo.route)}</b></div>
            <p>{t(routeInfo.note)}</p>
            <a className="route-map-link" href={routeInfo.maps} target="_blank" rel="noreferrer">{t("CHECK LIVE ROUTE IN GOOGLE MAPS ↗")}</a>
          </div>
        </section>

        <section className="train-payment-cards train-clean-section">
          <h2>{t("TAP.")}<br /><span>{t("GO.")}</span></h2>
          <div className="train-simple-cards">
            <article><strong>{t("SUICA / PASMO")}</strong><p>{t("Tap in and out on participating trains and buses. Rechargeable and widely useful.")}</p></article>
            <article><strong>{t("CONTACTLESS")}</strong><p>{t("Supported contactless cards work on participating Tokyo Metro services and locations.")}</p></article>
            <article><strong>{t("CASH")}</strong><p>{t("Keep some yen for smaller shops, buses or backup situations.")}</p></article>
            <article><strong>{t("DAY PASSES")}</strong><p>{t("Choose a pass only when your planned rides make the fixed price worthwhile.")}</p></article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TrainGuide() {
  const t = useCopy();
  const [activeLine, setActiveLine] = useState("ALL");
  const [activeOperator, setActiveOperator] = useState("ALL");
  const [selectedStation, setSelectedStation] = useState("Shinjuku");
  const [from, setFrom] = useState("Shinjuku");
  const [to, setTo] = useState("Shibuya");
  const [routeSubmitted, setRouteSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryNotice, setDirectoryNotice] = useState("");
  const [openOperator, setOpenOperator] = useState("");
  const [mapResetKey, setMapResetKey] = useState(0);
  const selectedLine = transportLines.find((line) => line.id === activeLine);
  const routeInfo = touristRoutes.find(([origin, destination]) => origin === from && destination === to);
  const routeMapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${from} Station, Tokyo`)}&destination=${encodeURIComponent(`${to} Station, Tokyo`)}&travelmode=transit`;
  const searchResults = [
    ...stationPoints
      .map(([name]) => ({ type: "station", name }))
      .filter((result) => query && result.name.toLowerCase().includes(query.toLowerCase())),
    ...railwayDirectory
      .flatMap((group) => group.lines.map((line) => ({ type: "line", name: line.name, operator: group.operator, mapId: line.mapId })))
      .filter((result) => query && result.name.toLowerCase().includes(query.toLowerCase())),
  ].slice(0, 8);
  const selectedStationDetails = stationDetails[selectedStation];
  const selectedStationLines = transportLines.filter((line) => line.stations.some((station) => station.toLowerCase() === selectedStation.toLowerCase()));
  const directoryMatches = railwayDirectory
    .map((group) => ({
      ...group,
      lines: group.lines.filter((line) => `${line.name} ${line.code ?? ""} ${line.corridor}`.toLowerCase().includes(directorySearch.toLowerCase())),
    }))
    .filter((group) => group.lines.length > 0);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const selectSearchResult = (result) => {
    if (result.type === "station") {
      setSelectedStation(result.name);
    } else {
      const line = transportLines.find((item) => item.id === result.mapId);
      setDirectoryNotice({ lineName: result.name, isMapped: Boolean(result.mapId) });
      setActiveOperator(line?.operator ?? "ALL");
      setActiveLine(result.mapId ?? "ALL");
    }
    setQuery("");
    scrollTo("train-map");
  };

  const chooseDirectoryLine = (line, operator) => {
    if (!line.mapId) {
      setDirectoryNotice({ lineName: line.name, isMapped: false });
      return;
    }
    setActiveOperator(operator);
    setActiveLine(line.mapId);
    setDirectoryNotice({ lineName: line.name, isMapped: true });
    scrollTo("train-map");
  };

  const chooseShortcut = (origin, destination) => {
    setFrom(origin);
    setTo(destination);
    setRouteSubmitted(true);
    scrollTo("route-finder");
  };

  return (
    <>
      <section className="transport-hero transport-hero-photo train-hero">
        <OptimizedImage className="transport-hero-image" src="https://images.pexels.com/photos/31385056/pexels-photo-31385056.jpeg?cs=srgb&fm=jpg" alt={t("Tokyo railway station")} priority sizes="100vw" referrerPolicy="no-referrer" />
        <div className="transport-hero-overlay" />
        <div className="transport-hero-copy">
          <span className="section-label">{t("TOKYO / RAILWAY GUIDE")}</span>
          <h1>{t("TOKYO RAILWAY GUIDE")}</h1>
          <p>{t("Navigate Tokyo like a local. Understand the train lines, discover stations, and find your way around Japan's extensive railway network.")}</p>
          <div className="train-hero-search">
            <label htmlFor="train-quick-search">{t("Search a station or train line...")}</label>
            <input id="train-quick-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search a station or train line...")} autoComplete="off" />
            {!!query && <div className="train-search-results" role="listbox" aria-label={t("Stations and lines")}>
              {searchResults.map((result) => (
                <button type="button" role="option" key={`${result.type}-${result.name}`} onClick={() => selectSearchResult(result)}>
                  <span>{t(result.name)}</span><small>{result.type === "station" ? t("Station") : t(result.operator)}</small>
                </button>
              ))}
              {!searchResults.length && <p>{t("No matching stations or lines.")}</p>}
            </div>}
          </div>
          <nav className="train-quick-links" aria-label={t("Railway operators and airport access")}>
            {[
              ["JR Lines", "JR EAST", "rail-directory"],
              ["Tokyo Metro", "TOKYO METRO", "rail-directory"],
              ["Toei Subway", "TOEI SUBWAY", "rail-directory"],
              ["Private Railways", "PRIVATE RAILWAYS & SPECIAL TRANSIT", "rail-directory"],
              ["Airport Access", "AIRPORT ACCESS", "airport-access"],
            ].map(([label, operator, target]) => (
              <a key={label} href={`#${target}`} onClick={() => {
                setDirectorySearch("");
                if (target === "rail-directory") setOpenOperator(operator);
              }}>{t(label)}</a>
            ))}
          </nav>
          <p className="train-beginner-prompt">{t("First time riding Tokyo trains?")} <a href="#before-you-board">{t("Start here.")}</a></p>
        </div>
      </section>

      <main className="train-guide-page">
        <section className="train-guide-section train-map-section" id="train-map">
          <div className="train-section-heading">
            <span className="section-label">{t("INTERACTIVE NETWORK")}</span>
            <h2>{t("Explore the railway map")}</h2>
            <p>{t("Zoom and drag the map. Select a station for visitor information or a highlighted line for its mapped stops.")}</p>
          </div>
          <p className="train-map-coverage"><strong>{t("Map coverage")}</strong> {t("This guide highlights eight selected corridors and visitor station areas: Yamanote, Ginza, Asakusa, Hibiya, Marunouchi, Hanzomon, Fukutoshin and Oedo. Colored links are simplified between mapped hubs, not complete track geometry. The map is not a full network, timetable, or live service feed.")}</p>
          <div className="train-map-filters" role="group" aria-label={t("Filter map by operator")}>
            {["ALL", "JR EAST", "TOKYO METRO", "TOEI SUBWAY"].map((operator) => (
              <button type="button" key={operator} className={activeOperator === operator ? "is-active" : ""} onClick={() => { setActiveOperator(operator); setActiveLine("ALL"); setDirectoryNotice(""); }}>
                {t(operator === "ALL" ? "All mapped lines" : operator)}
              </button>
            ))}
          </div>
          <div className="train-line-picker" aria-label={t("Filter by train line")}>
            {transportLines.filter((line) => activeOperator === "ALL" || line.operator === activeOperator).map((line) => (
              <button type="button" key={line.id} className={activeLine === line.id ? "is-active" : ""} onClick={() => { setActiveLine(activeLine === line.id ? "ALL" : line.id); setDirectoryNotice(""); }}>
                <i style={{ backgroundColor: line.color }} />{t(line.name)} <small>{line.code}</small>
              </button>
            ))}
          </div>
          <div className="train-map-layout">
            <div className="train-map-frame">
              <TrainMap
                activeLine={activeLine}
                activeOperator={activeOperator}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
                onSelectLine={(lineId) => {
                  const line = transportLines.find((item) => item.id === lineId);
                  setActiveLine(lineId);
                  setActiveOperator(line?.operator ?? "ALL");
                  setDirectoryNotice("");
                }}
                resetKey={mapResetKey}
              />
              <button className="train-map-reset" type="button" onClick={() => { setMapResetKey((key) => key + 1); setActiveLine("ALL"); setActiveOperator("ALL"); }}>{t("Reset map")}</button>
            </div>
            <aside className="train-station-panel" aria-live="polite">
              <span className="section-label">{t("STATION INFORMATION")}</span>
              <h3>{t(selectedStation)} {t("Station")}</h3>
              <p>{t("Station codes and line names shown are reference information; confirm signs at the station.")}</p>
              <h4>{t("Lines & station codes")}</h4>
              <ul>{(selectedStationDetails?.codes ?? selectedStationLines.map((line) => `${line.name} (${line.code})`)).map((code) => <li key={code}>{t(code)}</li>)}</ul>
              {selectedStationDetails?.attractions && <><h4>{t("Nearby")}</h4><p>{t(selectedStationDetails.attractions)}</p></>}
              {selectedStationDetails?.usefulArea && <><h4>{t("Visitor tip")}</h4><p>{t(selectedStationDetails.usefulArea)}</p></>}
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedStation} Station, Tokyo`)}`} target="_blank" rel="noreferrer">{t("Open station in Google Maps ↗")}</a>
              {selectedLine && <div className="train-selected-line">
                <h4><i style={{ backgroundColor: selectedLine.color }} />{t(selectedLine.name)} ({selectedLine.code})</h4>
                <p>{t("Mapped key stops")}: {selectedLine.stations.map((station) => t(station)).join(" · ")}</p>
                <small>{t("Selected stations only; intermediate stops are not shown.")}</small>
              </div>}
              {directoryNotice && <p className="train-map-notice">{t(directoryNotice.lineName)}: {t(directoryNotice.isMapped ? "the map shows selected station-to-station corridors, not full track geometry." : "This line is listed in the directory, but is not included in the map overlay.")}</p>}
            </aside>
          </div>
          <p className="train-map-legend"><strong>{t("Legend")}</strong> {t("JR East")}, {t("Tokyo Metro")}, {t("Toei Subway")}: {t("line colors follow common operator line-color references where available. White circles mark selected station areas. Pan and zoom using the map controls.")}</p>
          <span className="train-map-attribution">{t("Map tiles © OpenStreetMap contributors. Station pins indicate approximate station areas.")}</span>
        </section>

        <section className="train-guide-section" id="rail-directory">
          <div className="train-section-heading">
            <span className="section-label">{t("LINE DIRECTORY")}</span>
            <h2>{t("Find your line")}</h2>
            <p>{t("Browse the major Tokyo-area operators. Station lists below are key tourist stops and corridors, not every stop on each service.")}</p>
          </div>
          <label className="train-directory-search">
            <span>{t("Search lines and destinations")}</span>
            <input type="search" value={directorySearch} onChange={(event) => setDirectorySearch(event.target.value)} placeholder={t("Type a line, code, or destination")} />
          </label>
          <div className="train-directory">
            {directoryMatches.map((group) => (
              <details className="train-operator" key={group.operator} open={!!directorySearch || openOperator === group.operator}>
                <summary><span>{t(group.operator)}</span><small>{t(group.type)} · {group.lines.length} {t("lines")}</small></summary>
                <div className="train-directory-lines">
                  {group.lines.map((line) => (
                    <article className="train-directory-line" key={line.name}>
                      <i className="train-directory-line__swatch" style={line.color ? { backgroundColor: line.color } : undefined} />
                      <div>
                        <h3>{t(line.name)} {line.code && <small>{line.code}</small>}</h3>
                        <p>{t(line.corridor)}</p>
                        {line.mapId
                          ? <button type="button" onClick={() => chooseDirectoryLine(line, group.operator)}>{t("Highlight on map")}</button>
                          : <small className="train-directory-coverage">{t("Directory reference only; detailed route geometry is not included on this map.")}</small>}
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            ))}
            {!directoryMatches.length && <p className="train-empty-state">{t("No matching railway lines.")}</p>}
          </div>
          <p className="train-operator-note">{t("Tokyo Metro and Toei Subway are separate operators with separate fares and station gates. Follow the operator and line signs when transferring.")}</p>
        </section>

        <section className="train-guide-section train-route-section" id="route-finder">
          <div className="train-section-heading">
            <span className="section-label">{t("ROUTE FINDER")}</span>
            <h2>{t("Plan a journey")}</h2>
            <p>{t("Choose two stations to open a live transit planner. This site does not provide live schedules, fares, platform assignments, or disruptions.")}</p>
          </div>
          <form className="train-route-form" onSubmit={(event) => { event.preventDefault(); setRouteSubmitted(true); }}>
            <label>{t("FROM")}<select value={from} onChange={(event) => setFrom(event.target.value)}>{routePlaces.map((station) => <option key={station} value={station}>{t(station)}</option>)}</select></label>
            <span aria-hidden="true">→</span>
            <label>{t("TO")}<select value={to} onChange={(event) => setTo(event.target.value)}>{routePlaces.map((station) => <option key={station} value={station}>{t(station)}</option>)}</select></label>
            <button type="submit">{t("FIND ROUTE")}</button>
          </form>
          {routeSubmitted && <div className="train-route-result" aria-live="polite">
            <div>
              <span className="section-label">{t("ILLUSTRATIVE ROUTE GUIDANCE")}</span>
              <h3>{t(from)} → {t(to)}</h3>
              {from === to
                ? <p>{t("Choose two different stations to plan a trip.")}</p>
                : routeInfo
                  ? <><p>{t(routeInfo[2])}</p><p>{t("This is an illustrative suggestion, not a live route. Check station signs for the correct platform and current service.")}</p></>
                  : <p>{t("No route details are stored for this station pair. Use the live planner below for current options.")}</p>}
              <p className="train-route-disclaimer">{t("Travel times, fares, transfers and platform information are not estimated here.")}</p>
            </div>
            <a href={routeMapUrl} target="_blank" rel="noreferrer">{t("Open Google Maps Transit ↗")}</a>
          </div>}
        </section>

        <section className="train-guide-section train-shortcuts-section">
          <div className="train-section-heading">
            <span className="section-label">{t("TOURIST SHORTCUTS")}</span>
            <h2>{t("Popular journeys")}</h2>
          </div>
          <div className="train-shortcuts">
            {touristRoutes.map(([origin, destination, hint]) => (
              <button type="button" key={`${origin}-${destination}`} onClick={() => chooseShortcut(origin, destination)}>
                <span>{t(origin)} <b>→</b> {t(destination)}</span>
                <small>{t(hint)}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="train-guide-section" id="before-you-board">
          <div className="train-section-heading">
            <span className="section-label">{t("FIRST-TIME VISITORS")}</span>
            <h2>{t("BEFORE YOU BOARD")}</h2>
            <p>{t("Open a topic for simple, practical advice.")}</p>
          </div>
          <div className="train-learning-grid">
            {visitorGuides.map((guide) => (
              <details className="train-learning-card" key={guide.title}>
                <summary>{t(guide.title)}</summary>
                <ul>{guide.items.map((item) => <li key={item}>{t(item)}</li>)}</ul>
              </details>
            ))}
          </div>
        </section>

        <section className="train-guide-section" id="airport-access">
          <div className="train-section-heading">
            <span className="section-label">{t("AIRPORT ACCESS")}</span>
            <h2>{t("From the airport to Tokyo")}</h2>
            <p>{t("Services, stopping patterns, prices and reservation rules can change. Confirm the current details with the operator before departure.")}</p>
          </div>
          <div className="train-airport-grid">
            {airportServices.map((airport) => (
              <article className="train-airport-card" key={airport.airport}>
                <span className="section-label">{t(airport.airport)}</span>
                {airport.services.map((service) => (
                  <div key={service.name}>
                    <h3>{t(service.name)}</h3>
                    <p>{t(service.route)}</p>
                    <small>{t("Check the operator's official website or airport station counter for tickets, boarding location, current fares and service.")}</small>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ThingsToDo() {
  const t = useCopy();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <main className="activities-page activities-page--simple">
        <section className="things-simple-hero">
          <OptimizedImage
            src="https://wallpaperaccess.com/full/259516.jpg"
            alt="Tokyo city view"
            priority
            sizes="100vw"
          />
          <div className="things-simple-hero__shade" />
          <div className="things-simple-hero__copy">
            <span className="section-label">{t("TOKYO / EXPERIENCES")}</span>
            <h1>{t("THINGS TO DO")}</h1>
            <p>{t("Find your own way through Tokyo.")}</p>
          </div>
        </section>
        <PlacesToGoSection />
        <ShoppingGuideSection />
        <FoodBentoSection />
        <DayTripsSection />
      </main>

      <Footer />
    </>
  );
}

function Gallery() {
  const t = useCopy();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const filtered = gallery;
  const selected = selectedIndex === null ? null : gallery[selectedIndex];

  const openPhoto = (photo) => {
    const index = gallery.findIndex((item) => item.number === photo.number);
    if (index >= 0) setSelectedIndex(index);
  };
  const closePhoto = () => setSelectedIndex(null);
  const movePhoto = (direction) => setSelectedIndex((current) => current === null ? null : (current + direction + gallery.length) % gallery.length);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") closePhoto();
      if (event.key === "ArrowRight") movePhoto(1);
      if (event.key === "ArrowLeft") movePhoto(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);

  const SafeImage = ({ src, alt, className = "", ...props }) => (
    <OptimizedImage
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      sizes="100vw"
      referrerPolicy="no-referrer"
      onError={(event) => {
        event.currentTarget.style.opacity = "0";
        event.currentTarget.parentElement?.classList.add("image-load-failed");
      }}
      {...props}
    />
  );

  return (
    <>
      <main className="gallery-page gallery-page-enhanced">
        <h1 className="gallery-page-title">{t("THE GALLERY")}</h1>

        <AccordionGallery
          className="gallery-accordion"
          items={filtered.map((photo) => ({
            id: photo.number,
            image: photo.image,
            label: t(photo.title),
            alt: t(photo.title),
            photo,
          }))}
          defaultIndex={Math.min(2, filtered.length - 1)}
          accentColor="#d4a46b"
          overlayColor="#121a15"
          textColor="#f1f2ec"
          height={500}
          gap={8}
          radius={4}
          expandRatio={0.46}
          trigger="hover"
          onActiveClick={(item) => openPhoto(item.photo)}
        />
      </main>

      {selected && createPortal(
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${t(selected.title)} ${t("photo viewer")}`} onClick={closePhoto}>
          <button type="button" className="gallery-modal-close" onClick={closePhoto} aria-label={t("Close photo viewer")}>×</button>
          <button type="button" className="gallery-modal-arrow gallery-modal-prev" onClick={(event) => { event.stopPropagation(); movePhoto(-1); }} aria-label={t("Previous photo")}>←</button>
          <figure className="gallery-modal-inner" onClick={(event) => event.stopPropagation()}>
            <div className="gallery-modal-image">
              <SafeImage src={selected.image} alt={t(selected.title)} />
            </div>
            <figcaption>
              <span>{selected.number} / {t(selected.category)}</span>
              <strong>{t(selected.title)}</strong>
              <small>{t(selected.location)}</small>
            </figcaption>
          </figure>
          <button type="button" className="gallery-modal-arrow gallery-modal-next" onClick={(event) => { event.stopPropagation(); movePhoto(1); }} aria-label={t("Next photo")}>→</button>
        </div>,
        document.body
      )}

      <Footer />
    </>
  );
}

function DayTripsSection() {
  const t = useCopy();
  const trips = [
    {
      number: "01",
      title: "Kamakura",
      subtitle: "COASTAL ESCAPE",
      text: "A seaside town of temples, the Great Buddha and relaxed streets, about an hour from central Tokyo.",
      image: places[6].image,
      details: "Kamakura works best as a slow, walkable day away from the city. Start with the shrine district, follow the small shops and cafes around Komachi-dori, then continue west toward the Great Buddha and Hase-dera. Finish by the water at Yuigahama before taking the train back to Tokyo.",
      itinerary: ["08:00 · Depart Tokyo for Kamakura", "09:15 · Tsurugaoka Hachimangu shrine", "10:45 · Walk and browse Komachi-dori", "12:00 · Lunch near the old town", "13:30 · Great Buddha in Kotoku-in", "14:30 · Hase-dera temple and hillside views", "16:00 · Yuigahama beach walk", "17:30 · Return to Tokyo"],
    },
    {
      number: "02",
      title: "Kawaguchiko / Mt. Fuji",
      subtitle: "MOUNTAIN VIEWS",
      text: "A lakeside day trip for wide Fuji views, scenic railways and a slower rhythm beyond the city.",
      image: places[7].image,
      details: "Kawaguchiko is best treated as a weather-led day trip. Leave early for the clearest mountain views, keep the lakeside route flexible, and allow time for the ropeway, local cafes and photo stops. Even when Fuji is hidden, the lake, hills and slower rhythm make the journey worthwhile.",
      itinerary: ["07:00 · Depart Tokyo for Kawaguchiko", "09:30 · Arrive and check the lakeside forecast", "10:00 · Oishi Park and Fuji viewpoints", "11:30 · Local lunch with mountain views", "13:00 · Mt. Fuji Panoramic Ropeway", "14:30 · Lake walk or scenic railway stop", "16:00 · Cafe and final photo stops", "17:00 · Return to Tokyo"],
    },
    {
      number: "03",
      title: "Kawagoe",
      subtitle: "LITTLE EDO",
      text: "Wander historic storehouse streets, visit the bell tower and browse the old town's sweets shops.",
      image: "https://static.gltjp.com/glt/data/article/21000/20523/20231117_082209_160e653e_w1920.webp",
      details: "Kawagoe makes an easy escape for a day among traditional storehouses and temple grounds. Walk the Kurazukuri district, listen for the bell at Toki no Kane and stop along Kashiya Yokocho for local sweets. Leave time for the gardens and halls of Kita-in before heading back to Tokyo.",
      itinerary: ["08:30 · Depart Tokyo for Kawagoe", "09:30 · Kurazukuri old-town streets", "10:30 · Toki no Kane bell tower", "11:00 · Sweets along Kashiya Yokocho", "12:00 · Lunch in the historic district", "13:30 · Kita-in temple and gardens", "15:00 · Browse local shops", "16:30 · Return to Tokyo"],
    },
    {
      number: "04",
      title: "Yokohama",
      subtitle: "HARBOR CITY",
      text: "Explore a lively waterfront, historic red-brick warehouses and the flavors of Chinatown.",
      image: "https://images.trvl-media.com/place/6102742/1ae06a59-6da3-491d-aeae-11ab8189b9af.jpg",
      details: "Yokohama pairs a breezy waterfront with a lively port-city character. Start around Minato Mirai, walk the Red Brick Warehouse waterfront and continue to Yamashita Park. Save time for Chinatown, where narrow lanes and busy restaurants make an easy end to the day.",
      itinerary: ["09:00 · Depart Tokyo for Yokohama", "10:00 · Minato Mirai waterfront", "11:00 · Red Brick Warehouse", "12:30 · Lunch in Chinatown", "14:00 · Yamashita Park and the harbor", "15:30 · Walk the historic port district", "17:00 · Return to Tokyo"],
    },
    {
      number: "05",
      title: "Hakone",
      subtitle: "MOUNTAIN RETREAT",
      text: "Take in mountain scenery, volcanic landscapes and the calm of Lake Ashi.",
      image: "https://t3.ftcdn.net/jpg/02/48/70/54/360_F_248705449_95pJle12PhFPCkNgjOAWPYYH3BlklVqk.jpg",
      details: "Hakone rewards an early start and a flexible route through the mountains. Ride the ropeway over Owakudani, then continue toward Lake Ashi for a lakeside walk and a visit to Hakone Shrine. Check transport and weather before setting out, as mountain routes can change with conditions.",
      itinerary: ["07:00 · Depart Tokyo for Hakone", "09:30 · Arrive in the Hakone area", "10:00 · Owakudani volcanic valley", "11:30 · Ropeway toward Lake Ashi", "12:30 · Lunch by the lake", "14:00 · Hakone Shrine and lakeside walk", "16:00 · Return toward Tokyo"],
    },
    {
      number: "06",
      title: "Nikko",
      subtitle: "SHRINES & FORESTS",
      text: "See ornate shrine architecture framed by cedar forests and mountain scenery.",
      image: "https://cdn.getyourguide.com/image/format=auto%2Cfit=crop%2Cgravity=auto%2Cquality=60%2Cwidth=400%2Cheight=265%2Cdpr=2/tour_img/86b7682b27bbb74357fcc74e5d1840758a3b118a840424a43144eabe5aba5738.png",
      details: "Nikko is a full day out, with ornate shrine architecture set among tall cedar trees. Focus your visit on the Toshogu Shrine complex, Rinno-ji and the Shinkyo Bridge, and leave the wider lake and waterfall area for a separate trip unless you have extra time.",
      itinerary: ["07:00 · Depart Tokyo for Nikko", "09:30 · Arrive and walk to the shrine area", "10:00 · Toshogu Shrine", "12:00 · Lunch near the historic district", "13:00 · Rinno-ji temple", "14:00 · Shinkyo Bridge and cedar-lined paths", "15:30 · Browse the town before departure", "17:00 · Return to Tokyo"],
    },
  ];
  const [selectedTrip, setSelectedTrip] = useState(null);
  const closeTrip = () => setSelectedTrip(null);
  const slides = trips.map((trip) => ({
    title: t(trip.title),
    subtitle: t(trip.text),
    src: trip.image,
    alt: t(trip.title),
  }));

  return (
    <section className="faq-day-trips" id="day-trips">
      <div className="faq-day-trips__heading">
        <span className="section-label">{t("TOKYO / DAY TRIPS")}</span>
        <h2>{t("BEYOND")}<br /><span>{t("THE CITY.")}</span></h2>
        <p>{t("Six easy escapes when Tokyo calls for a different pace.")}</p>
      </div>
      <CoverflowCarousel
        slides={slides}
        cardWidth="clamp(220px, 34vw, 400px)"
        rotate={42}
        depth={0.58}
        gap={0.05}
        showCardCaption
        showPagination
        showNavigation
        autoplay
        interval={5}
        label={t("Tokyo day trips")}
        className="day-trip-coverflow"
        onSelect={(index) => setSelectedTrip(trips[index])}
      />
      {selectedTrip && createPortal(
        <div className="day-trip-modal" role="dialog" aria-modal="true" aria-labelledby="day-trip-modal-title" onClick={closeTrip}>
          <section className="day-trip-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="day-trip-modal__close" onClick={closeTrip} aria-label={t("Close day trip details")}>×</button>
            <span className="section-label">{t(selectedTrip.subtitle)}</span>
            <h2 id="day-trip-modal-title">{t(selectedTrip.title)}</h2>
            <p className="day-trip-modal__details">{t(selectedTrip.details)}</p>
            <h3>{t("SAMPLE ITINERARY")}</h3>
            <ol>
              {selectedTrip.itinerary.map((stop) => <li key={stop}>{t(stop)}</li>)}
            </ol>
          </section>
        </div>,
        document.body,
      )}
    </section>
  );
}

function FoodBentoSection() {
  const t = useCopy();
  const [selectedFood, setSelectedFood] = useState(null);
  const foods = [
    { id: 1, title: "Sushi counters", desc: "Seasonal fish, careful rice and the quiet theatre of a Tokyo counter.", image: "https://www.craftycookbook.com/wp-content/uploads/2024/04/nigiri-sushi-1200.jpg", className: "food-bento-card--large", spots: [{ name: "Sushi no Midori Ginza", area: "Ginza" }, { name: "Tsukiji Outer Market", area: "Tsukiji" }] },
    { id: 2, title: "Ramen", desc: "A hot bowl for late trains, rainy evenings and standing-room neighbourhood shops.", image: "https://shop.ichiranusa.com/cdn/shop/files/Finishedramenwithscallion_1.jpg?v=1776107518", className: "food-bento-card--tall", spots: [{ name: "Ichiran Shibuya", area: "Shibuya" }, { name: "Fuunji", area: "Shinjuku" }] },
    { id: 3, title: "Tempura", desc: "Light batter, seasonal vegetables and seafood served at its crispest.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkIlRMPugkVKqRL1ZvNzwAV1vAgpG4TPjTGZRJBpvz8GhddDSJ5phDftQ&s=10", className: "food-bento-card--wide", spots: [{ name: "Tempura Kondo", area: "Ginza" }, { name: "Shinjuku Tsunahachi", area: "Shinjuku" }] },
    { id: 4, title: "Yakitori", desc: "Charcoal-grilled skewers, tare glaze and the warm energy of a tiny izakaya.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Yakitori.jpg", className: "food-bento-card--small", spots: [{ name: "Omoide Yokocho", area: "Shinjuku" }, { name: "Torikizoku Shibuya Center-gai", area: "Shibuya" }] },
    { id: 5, title: "Matcha sweets", desc: "A slower final stop: bitter green tea, soft texture and a little sweetness.", image: "https://ekogram.pl/cdn/shop/articles/matcha-jak-przygotowac_b988da34-79fe-4639-9b36-e9fd10dde826.jpg?v=1773227040", className: "food-bento-card--small food-bento-card--matcha", spots: [{ name: "Suzukien Asakusa", area: "Asakusa" }, { name: "Nakamura Tokichi Ginza", area: "Ginza" }] },
    { id: 6, title: "Gyukatsu", desc: "Crisp breaded beef, seared at the table for a tender center and deep savory flavor.", image: "https://japanesetaste.com/cdn/shop/articles/Gyukatsu_Cover_Photo_a41ff13e-8fc4-40c7-8ce7-6bc09ba4cb18.jpg?v=1767083074&width=600", className: "food-bento-card--large", spots: [{ name: "Gyukatsu Motomura Shibuya", area: "Shibuya" }, { name: "Gyukatsu Kyoto Katsugyu Shinjuku", area: "Shinjuku" }] },
    { id: 7, title: "Wagyu", desc: "Richly marbled Japanese beef, best enjoyed slowly at a yakiniku or steak counter.", image: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/nbrxefq9l3ms2mlo6lbo.jpg", className: "food-bento-card--tall", spots: [{ name: "Yoroniku", area: "Minami-Aoyama" }, { name: "Jojoen Shinjuku", area: "Shinjuku" }] },
    { id: 8, title: "Takoyaki", desc: "Hot, crisp-edged octopus bites topped with savory sauce, bonito and aonori.", image: "https://sudachirecipes.com/wp-content/uploads/2025/08/takoyaki-new-thumb.jpg", className: "food-bento-card--tall", spots: [{ name: "Gindaco Asakusa", area: "Asakusa" }, { name: "Tsukiji Gindaco Shibuya", area: "Shibuya" }] },
    { id: 9, title: "Famichiki", desc: "FamilyMart's famously juicy, crunchy hot-counter fried chicken, perfect for a quick konbini stop.", image: "https://nutriscan.app/calories-nutrition/images/famichiki-familymart-b1603.webp", className: "food-bento-card--large", spots: [{ name: "FamilyMart Shibuya Center-gai", area: "Shibuya" }, { name: "FamilyMart Shinjuku Kabukicho", area: "Shinjuku" }] },
    { id: 10, title: "Curry katsu", desc: "Golden pork cutlet over rice with a generous pour of warm Japanese curry.", image: "https://umamibites.com/wp-content/uploads/2024/08/UB210_01.jpg", className: "food-bento-card--large", spots: [{ name: "CoCo Ichibanya Shibuya", area: "Shibuya" }, { name: "Tonkatsu Marugo", area: "Akihabara" }] },
  ];

  return (
    <section className="food-bento-section" id="food">
      <div className="food-bento-heading">
        <span className="section-label">{t("TOKYO / FOOD")}</span>
        <h2>{t("FOODS")}<br /><span>{t("TO TRY.")}</span></h2>
        <p>{t("Follow the steam, the charcoal and the small signs glowing after dark.")}</p>
      </div>
      <div className="food-bento-grid">
        {foods.map((food, index) => (
          <motion.article
            key={food.id}
            className={`food-bento-card ${food.className}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: .55, delay: index * .06, ease: "easeOut" }}
            onClick={() => setSelectedFood(food)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedFood(food);
              }
            }}
          >
            <OptimizedImage src={food.image} alt={t(food.title)} loading="lazy" decoding="async" sizes="(max-width: 700px) 100vw, 42vw" />
            <div className="food-bento-card__overlay">
              <span>{String(food.id).padStart(2, "0")}</span>
              <h3>{t(food.title)}</h3>
              <p>{t(food.desc)}</p>
            </div>
          </motion.article>
        ))}
      </div>
      {selectedFood && createPortal(
        <div className="food-bento-modal" role="dialog" aria-modal="true" aria-labelledby="food-bento-modal-title" onClick={() => setSelectedFood(null)}>
          <section className="food-bento-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="food-bento-modal__close" onClick={() => setSelectedFood(null)} aria-label={t("Close food details")}>×</button>
            <OptimizedImage src={selectedFood.image} alt={t(selectedFood.title)} loading="eager" sizes="(max-width: 700px) 100vw, 720px" />
            <div>
              <span className="section-label">{t("FOOD TO TRY")}</span>
              <h2 id="food-bento-modal-title">{t(selectedFood.title)}</h2>
              <p>{t(selectedFood.desc)}</p>
              <section className="food-bento-modal__spots" aria-labelledby="food-bento-spots-title">
                <h3 id="food-bento-spots-title">{t("GOOD SPOTS IN TOKYO")}</h3>
                <ul>
                  {selectedFood.spots.map((spot) => (
                    <li key={spot.name}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name}, ${spot.area}, Tokyo, Japan`)}`} target="_blank" rel="noopener noreferrer">
                        <span><strong>{t(spot.name)}</strong><small>{t(spot.area)}</small></span>
                        <span className="food-bento-modal__map-link">{t("OPEN IN MAP")} <b aria-hidden="true">↗</b></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </section>
  );
}

function TaxFreeSection() {
  const t = useCopy();

  return (
    <section className="taxfree-section things-taxfree">
      <div className="taxfree-card">
        <h2>{t("NOVEMBER")}<br /><span>{t("MATTERS.")}</span></h2>
        <p>{t("Japan's tax-free shopping system changes on November 1, 2026. Under the new system, eligible visitors pay consumption tax at purchase and receive the refund after passing customs on departure. Bring your original passport and follow the retailer's instructions.")}</p>
        <small>{t("The rules and eligibility can change. Check the official Tokyo Tourism / Japan Tourism Agency guidance close to your trip.")}</small>
      </div>
    </section>
  );
}

function FAQ() {
  const t = useCopy();
  const reduceMotion = useReducedMotion();
  const questions = [
    [
      "01",
      "What is the best time to visit Tokyo?",
      "Spring (March to May) and autumn (October to November) usually bring comfortable weather. Cherry blossom timing varies each year, and Golden Week is especially busy. Summer is hot and humid; winter is cooler, often with clear skies.",
    ],
    [
      "02",
      "How many days do I need in Tokyo?",
      "Four or five days gives most first-time visitors room for several neighborhoods, museums or gardens, and unhurried meals. Three days can cover highlights at a faster pace; add days for day trips or a slower visit.",
    ],
    [
      "03",
      "How much money should I budget for a trip to Tokyo?",
      "As a rough daily guide per person, allow about ¥6,000–¥10,000 for budget meals, local transit and low-cost activities, or ¥12,000–¥25,000 for more restaurant meals and paid attractions. Accommodation, shopping, long-distance travel and special experiences are extra; prices vary by season and style.",
    ],
    [
      "04",
      "Is Tokyo expensive for tourists?",
      "Tokyo can be visited on many budgets. Casual meals, convenience stores, public parks and an extensive train network help keep costs manageable, while hotels, fine dining, taxis and popular experiences can raise the total quickly.",
    ],
    [
      "05",
      "What is the easiest way to get around Tokyo?",
      "For most visitors, use trains and subways for longer hops and walk within each neighborhood. A stored-value IC card makes transfers and small purchases easier. Check the last train before a late night out, and use a taxi when carrying luggage or traveling after service ends.",
    ],
    [
      "06",
      "Do I need a Suica or PASMO card?",
      "You do not strictly need one, but an IC card is convenient for trains, buses and many convenience stores. A mobile transit card or a visitor card such as Welcome Suica can work well; availability, supported devices and purchase locations can change, so check current operator guidance.",
    ],
    [
      "07",
      "What is the difference between Tokyo Metro and JR trains?",
      "They are separate rail operators with different lines, stations and fare products. Tokyo Metro runs subway lines, while JR operates lines such as the Yamanote Line. IC cards work across many services, but operator-specific passes may not cover every train you take.",
    ],
    [
      "08",
      "How do I get from Narita Airport to Tokyo?",
      "The Narita Express serves major hubs including Tokyo, Shinjuku and Shibuya; the Keisei Skyliner is a fast option for Ueno and Nippori. Other rail and bus services connect different areas. Choose based on your hotel, arrival time, luggage and current schedules.",
    ],
    [
      "09",
      "How do I get from Haneda Airport to central Tokyo?",
      "Keikyu trains connect Haneda with Shinagawa and other destinations, while the Tokyo Monorail runs to Hamamatsucho for onward JR connections. Airport buses and taxis are alternatives; check the route that best matches your hotel and arrival time.",
    ],
    [
      "10",
      "Do I need to carry cash in Tokyo?",
      "Cards and contactless payments are common, but some small restaurants, neighborhood shops, temple stalls and ticket machines may prefer or require cash. Carry a modest amount of yen and use ATMs at convenience stores or post offices when needed.",
    ],
    [
      "11",
      "Are credit cards widely accepted?",
      "Yes, especially at hotels, department stores, chain restaurants and larger attractions. Acceptance is less predictable at small independent businesses, so keep a backup payment method and a little cash.",
    ],
    [
      "12",
      "Is English commonly spoken in Tokyo?",
      "You will find English support at major stations, airports, hotels and tourist attractions, but it is not universal in everyday shops or restaurants. Translation apps, station names written in Japanese, and a saved hotel address are useful backups.",
    ],
    [
      "13",
      "What Japanese phrases should I know?",
      "Useful phrases include sumimasen (excuse me), arigatou gozaimasu (thank you), onegaishimasu (please), and kore o kudasai (this one, please). A friendly greeting and patient gestures go a long way; translation apps can help with longer questions.",
    ],
    [
      "14",
      "Is Tokyo safe for tourists?",
      "Tokyo is generally considered a safe city, but use the same care you would anywhere: watch your belongings in crowded places, take care around nightlife touts, follow local guidance during emergencies, and keep your accommodation address available.",
    ],
    [
      "15",
      "What should I know about Japanese train etiquette?",
      "Queue where marked, let passengers exit before boarding, keep conversations quiet, and set your phone to silent. Avoid blocking doors or priority spaces, and keep large luggage out of busy aisles when possible. Follow signs and staff instructions at each station.",
    ],
    [
      "16",
      "Do restaurants in Tokyo accept reservations?",
      "Many do, especially destination restaurants, small counters and popular weekend spots. Others are walk-in only. Check the restaurant's own booking information, note cancellation rules, and reserve early for high-demand places.",
    ],
    [
      "17",
      "Is tipping expected in Japan?",
      "No. Tipping is not customary in Japan and can cause confusion. A sincere thank-you is appreciated; some establishments add a service charge, which will be shown on the bill.",
    ],
    [
      "18",
      "Where should I stay in Tokyo?",
      "Choose by transit access and the kind of evenings you want. Shinjuku and Shibuya are lively and well connected; Ueno and Asakusa can feel more traditional; Tokyo Station and Ginza are central and convenient. Staying near a useful station matters more than being beside every attraction.",
    ],
    [
      "19",
      "What neighborhoods should I visit besides Shibuya and Shinjuku?",
      "Try Asakusa for historic streets, Ueno for museums and parks, Yanaka for a slower old-town walk, Daikanyama for design and cafes, Shimokitazawa for vintage shops and live music, or Kichijoji for Inokashira Park and local shopping.",
    ],
  ];

  const categories = [
    { id: "planning", label: "PLAN YOUR TRIP", questions: ["01", "02", "03", "04"] },
    { id: "transit", label: "TRAINS & AIRPORTS", questions: ["05", "06", "07", "08", "09"] },
    { id: "essentials", label: "MONEY & LANGUAGE", questions: ["10", "11", "12", "13"] },
    { id: "culture", label: "LOCAL ETIQUETTE", questions: ["14", "15", "16", "17"] },
    { id: "neighborhoods", label: "WHERE TO GO", questions: ["18", "19"] },
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [open, setOpen] = useState(null);
  const activeFaqCategory = categories.find((category) => category.id === activeCategory) ?? categories[0];
  const visibleQuestions = questions.filter(([number]) => activeFaqCategory.questions.includes(number));

  return (
    <>
      <section className="page-hero faq-hero">
        <span className="section-label">{t("TOKYO / QUESTIONS")}</span>

        <h1>
          {t("GOOD TO")}
          <br />
          <span>{t("KNOW.")}</span>
        </h1>

        <p>{t("Before you disappear into the city.")}</p>
      </section>

      <main className="faq-page">
        <div className="faq-explorer">
          <div className="faq-category-tabs" role="tablist" aria-label={t("FAQ topics")}>
            {categories.map((category) => (
              <button
                key={category.id}
                id={`faq-tab-${category.id}`}
                className={activeCategory === category.id ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls="faq-topic-panel"
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpen(null);
                }}
              >
                {t(category.label)}
              </button>
            ))}
          </div>
          <div className="faq-cards" id="faq-topic-panel" role="tabpanel" aria-labelledby={`faq-tab-${activeCategory}`}>
            {visibleQuestions.map(([number, question, answer]) => (
              <article className={`faq-card${open === number ? " is-open" : ""}`} key={number}>
                <button
                  id={`faq-question-${number}`}
                  type="button"
                  aria-expanded={open === number}
                  aria-controls={`faq-answer-${number}`}
                  onClick={() => setOpen(open === number ? null : number)}
                >
                  <span>{number}</span>
                  <strong>{t(question)}</strong>
                  <i aria-hidden="true">{open === number ? "−" : "+"}</i>
                </button>
                <motion.div
                  className="faq-card__answer-motion"
                  id={`faq-answer-${number}`}
                  aria-hidden={open !== number}
                  initial={false}
                  animate={{ height: open === number ? "auto" : 0, opacity: open === number ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="faq-card__answer"><p>{t(answer)}</p></div>
                </motion.div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <TaxFreeSection />

      <Footer />
    </>
  );
}

function ReachOut() {
  const t = useCopy();
  const [activeReachPhoto, setActiveReachPhoto] = useState(0);
  const reachPhotos = places.slice(0, 6);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReachPhoto((current) => (current + 1) % reachPhotos.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [reachPhotos.length]);

  const photo = reachPhotos[activeReachPhoto];

  return (
    <>
      <main className="reach-page reach-page--split">
        <section className="reach-panel">
          <div className="reach-panel__heading">
            <span className="section-label">{t("TOKYO / CONNECTION")}</span>
            <h1>{t("LET'S")}<br /><span>{t("TALK.")}</span></h1>
            <p>{t("Have a question, idea or just want to say hello?")}</p>
          </div>

          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <label>
              <span>{t("01 / NAME")}</span>
              <input type="text" placeholder={t("Your name")} autoComplete="name" />
            </label>

            <label>
              <span>{t("02 / EMAIL")}</span>
              <input type="email" placeholder={t("you@email.com")} autoComplete="email" />
            </label>

            <label>
              <span>{t("03 / MESSAGE")}</span>
              <textarea placeholder={t("Write something...")} rows="4" />
            </label>

            <button type="submit" className="submit-button">
              {t("SEND MESSAGE")} <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="reach-side">
            <span className="section-label">{t("CONTACT")}</span>
            <a href="mailto:hello@example.com">hello@example.com</a>
            <div className="social-links">
              <a href="#">{t("INSTAGRAM")}</a>
              <a href="#">{t("FACEBOOK")}</a>
              <a href="#">{t("GITHUB")}</a>
            </div>
          </div>
        </section>

        <aside className="reach-visual" aria-label={t("Scenes from Tokyo, Japan") }>
          <AnimatePresence initial={false}>
            <motion.div
              key={activeReachPhoto}
              className="reach-visual__slide"
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.35, ease: "easeInOut" }}
            >
              <OptimizedImage
                className="reach-visual__photo"
                src={photo.image}
                alt={`${photo.name}, Japan`}
                priority={activeReachPhoto === 0}
                loading={activeReachPhoto === 0 ? "eager" : "lazy"}
                sizes="(max-width: 850px) 100vw, 58vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="reach-visual__wash" aria-hidden="true" />
          <div className="reach-visual__caption" aria-live="polite">
            <h2>{t(photo.name)}</h2>
            <p>{t(photo.description)}</p>
          </div>
          <span className="reach-visual__stamp" aria-hidden="true">桜<br />東京</span>
        </aside>
      </main>

      <Footer />
    </>
  );
}

function Settings({ enabled, onSelectLanguage }) {
  const t = useCopy();
  return (
    <>
      <section className="page-hero settings-hero">
        <span className="section-label">{t("SETTINGS / LANGUAGE")}</span>
        <h1>{t("SETTINGS")}</h1>
        <p>{t("Use Japanese across the site")}</p>
      </section>
      <main className="settings-page">
        <section className="language-setting">
          <div>
            <span className="section-label">{t("01 / LANGUAGE")}</span>
            <h2>{t("Interface language")}</h2>
            <p>{t("Switch the site's visible copy to standard Japanese using kanji, katakana, and hiragana.")}</p>
          </div>
          <div className="language-options" role="group" aria-label={t("Interface language")}>
            <button type="button" aria-pressed={!enabled} className={!enabled ? "active" : ""} onClick={() => onSelectLanguage(false)}>{t("English")}</button>
            <button type="button" aria-pressed={enabled} className={enabled ? "active" : ""} onClick={() => onSelectLanguage(true)}>{t("Japanese")}</button>
          </div>
        </section>
        <p className="language-status" aria-live="polite">{enabled ? t("Japanese is on") : t("English")}</p>
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  const t = useCopy();
  return (
    <footer className="site-footer">
      <div className="footer-brand-mark" aria-hidden="true">T</div>
      <p className="footer-kicker">{t("TOKYO / BEYOND THE CITY")}</p>
      <div className="footer-link-groups">
        <nav aria-label={t("Places to explore")}>
          <h2>{t("EXPLORE TOKYO")}</h2>
          <a href="/things-to-do#places-to-go">{t("WHERE TO GO")}</a>
          <a href="/things-to-do#food">{t("FOOD")}</a>
          <a href="/things-to-do#shopping">{t("SHOPPING")}</a>
          <a href="/things-to-do#day-trips">{t("DAY TRIPS")}</a>
        </nav>
        <nav aria-label={t("Travel guides")}>
          <h2>{t("TRAVEL GUIDES")}</h2>
          <a href="/train">{t("TRAIN GUIDE")}</a>
          <a href="/faq">{t("FAQ")}</a>
          <a href="/#find-your-way">{t("FIND YOUR WAY")}</a>
        </nav>
        <nav aria-label={t("More from Tokyo")}>
          <h2>{t("MORE")}</h2>
          <a href="/">{t("HOME")}</a>
          <a href="/gallery">{t("GALLERY")}</a>
          <a href="/reach-out">{t("REACH OUT")}</a>
          <a href="/settings">{t("SETTINGS")}</a>
        </nav>
      </div>
      <div className="footer-rule" aria-hidden="true" />
      <div className="footer-bottom">
        <span>{t("© 2026 TOKYO — BEYOND THE CITY")}</span>
        <span>35°39′N / 139°42′E</span>
      </div>
    </footer>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("tokyo-theme");
  }, []);
  const [musicActive, setMusicActive] = useState(false);
  const [playerMinimized, setPlayerMinimized] = useState(false);
  const openMusicPlayer = () => {
    setMusicActive(true);
    setPlayerMinimized(false);
  };
  const [path, setPath] = useState(window.location.pathname);
  const [transitioning, setTransitioning] = useState(false);
  const [japanese, setJapanese] = useState(() => {
    const savedLanguage = localStorage.getItem("tokyo-language");
    return savedLanguage === "ja" || savedLanguage === "hiragana";
  });
  const appCopy = (text) => japanese ? getJapaneseCopy(text) : text;

  useEffect(() => {
    localStorage.setItem("tokyo-language", japanese ? "ja" : "en");
    document.documentElement.lang = japanese ? "ja" : "en";
  }, [japanese]);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    const onInternalLink = (event) => {
      const link = event.target.closest('a[href^="/"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.hash) return;
      event.preventDefault();
      const nextPath = url.pathname || "/";
      if (nextPath === window.location.pathname) return;
      setMenuOpen(false);
      setTransitioning(true);
      window.setTimeout(() => {
        window.history.pushState({}, "", nextPath);
        setPath(nextPath);
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 240);
      window.setTimeout(() => setTransitioning(false), 620);
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onInternalLink);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onInternalLink);
    };
  }, []);

  return (
    <JapaneseContext.Provider value={japanese}>
    <>
      <div className={`route-wipe ${transitioning ? "is-active" : ""}`} aria-hidden={!transitioning}>
        {transitioning && <FlowerLoader />}
      </div>
      <Header onMenu={() => setMenuOpen((open) => !open)} onPlay={openMusicPlayer} path={path} menuOpen={menuOpen} />
      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} path={path} />
      <div className="route-stage" key={path}>
        <Routes path={path} onPlay={openMusicPlayer} musicActive={musicActive} japanese={japanese} onSelectLanguage={setJapanese} />
      </div>
      {musicActive && (
        <aside className={`persistent-player persistent-player-open${playerMinimized ? " is-minimized" : ""}`} aria-label={appCopy("Tokyo soundtrack player")}>
          <div className="persistent-player-head">
            <span>{appCopy("wanna feel tokyo? / MAYONAKA NO DOOR")}</span>
            <span className="player-playing-indicator" aria-hidden="true"><i /><i /><i /></span>
            <a className="player-play-link" href="https://audiomack.com/karlpotat0/song/mayonaka-no-doorstay-with-me" target="_blank" rel="noreferrer" aria-label={appCopy("PLAY") }>
              <span aria-hidden="true">▶</span> {appCopy("PLAY")}
            </a>
            <button type="button" onClick={() => setPlayerMinimized((minimized) => !minimized)} aria-label={appCopy(playerMinimized ? "Expand player" : "Minimize player")} aria-expanded={!playerMinimized}>{playerMinimized ? "＋" : "−"}</button>
            <button type="button" onClick={() => setMusicActive(false)} aria-label={appCopy("Close player")}>×</button>
          </div>
          <iframe
            src="https://audiomack.com/embed/karlpotat0/song/mayonaka-no-doorstay-with-me"
            scrolling="no"
            title="Mayonaka no Door - Stay with Me"
            allow="autoplay; encrypted-media"
            referrerPolicy="no-referrer"
          />
        </aside>
      )}
    </>
    </JapaneseContext.Provider>
  );
}

function Routes({ path, onPlay, musicActive, japanese, onSelectLanguage }) {

  if (path === "/settings") {
    return <Settings enabled={japanese} onSelectLanguage={onSelectLanguage} />;
  }

  if (path === "/things-to-do") {
    return <ThingsToDo />;
  }

  if (path === "/gallery") {
    return <Gallery />;
  }

  if (path === "/train") {
    return <Train />;
  }

  if (path === "/faq") {
    return <FAQ />;
  }

  if (path === "/reach-out") {
    return <ReachOut />;
  }

  return <Home onPlay={onPlay} musicActive={musicActive} />;
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
