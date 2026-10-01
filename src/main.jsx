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

const HiraganaContext = createContext(false);
const hiraganaCopy = {
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
  Japanese: "にほんご",
  "Tokyo neighborhoods": "とうきょうのまち",
  "Street life": "まちのにぎわい",
  "Late trains": "よるのでんしゃ",
  "A City of Many Sides | いろんなまちが、ひとつに。": "いろんなまちが、ひとつに。",
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

const activities = [
  {
    category: "FOOD",
    title: "Eat your way through Tokyo",
    text: "Ramen, sushi counters, konbini runs and late-night bites. Tokyo rewards following the smell down the side street.",
    location: "TOKYO",
    hours: "VARIES",
    image: "https://images.pexels.com/photos/29502503/pexels-photo-29502503.jpeg?cs=srgb&fm=jpg",
    fit: "cover",
  },
  {
    category: "CULTURE",
    title: "Walk through Meiji Jingu",
    text: "Leave the noise behind and walk beneath the enormous torii gates and forest canopy.",
    location: "MEIJI JINGU",
    hours: "SUNRISE → SUNSET",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Meiji_Jingu_Shrine._Saki_Barrels._%2827915377617%29.jpg",
    fit: "cover",
  },
  {
    category: "SHOPPING",
    title: "Explore Harajuku",
    text: "Street fashion, independent shops, coffee and the lively lanes around Takeshita and Cat Street.",
    location: "HARAJUKU",
    hours: "VARIES",
    image: "https://static.gltjp.com/glt/data/directory/16000/15748/20240601_200047_ccb5f21c_w1920.webp",
    fit: "cover",
  },
  {
    category: "NIGHTLIFE",
    title: "See Shibuya after dark",
    text: "Cross the scramble, follow the neon and discover the streets beyond the famous intersection.",
    location: "SHIBUYA",
    hours: "OPEN LATE",
    image: "https://images.pexels.com/photos/35827257/pexels-photo-35827257.jpeg?cs=srgb&dl=pexels-margo-evardson-2158292018-35827257.jpg&fm=jpg",
    fit: "cover",
  },
  {
    category: "NATURE",
    title: "Slow down in Tokyo",
    text: "Yoyogi Park and the green spaces around Meiji create a completely different rhythm from the city center.",
    location: "YOYOGI / SHIBUYA",
    hours: "OPEN DAILY",
    image: "https://images.pexels.com/photos/31298878/pexels-photo-31298878.jpeg?cs=srgb&fm=jpg",
    fit: "cover",
  },
  {
    category: "EXPERIENCES",
    title: "See Tokyo from above",
    text: "Look across the skyline from Tokyo Skytree and watch the city change with the light.",
    location: "SUMIDA",
    hours: "VARIES",
    image: "https://images.pexels.com/photos/31415739/pexels-photo-31415739.jpeg?cs=srgb&fm=jpg",
    fit: "contain",
  },
  {
    category: "EXPERIENCES",
    title: "See Tokyo Tower at twilight",
    text: "Watch Minato shift from daylight to neon around one of Tokyo's most recognizable towers.",
    location: "MINATO",
    hours: "VARIES",
    image: "https://images.pexels.com/photos/19035824/pexels-photo-19035824.jpeg?cs=srgb&fm=jpg",
    fit: "contain",
  },
];
const extendedHiraganaCopy = {
  "CHECK LIVE ROUTE IN GOOGLE MAPS ↗": "ぐーぐるまっぷでろせんをみる ↗",
  "05 / PAYMENT": "05 / しはらい",
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
  "12 FRAMES / TOKYO + DAY TRIPS": "12まい / とうきょう と にちがえり",
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
  "08 / SHOPPING": "08 / かいもの",
  "09 / TAX-FREE — UPDATED 2026": "09 / めんぜい — 2026ねんこうしん",
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

function useCopy() {
  const hiragana = useContext(HiraganaContext);
  return (text) => hiragana ? extendedHiraganaCopy[text] ?? hiraganaCopy[text] ?? text : text;
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
          <div className="section-label">{t("01 / THE CITY")}</div>

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
            <span className="section-label">{t("02 / DESTINATIONS")}</span>
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
            <span className="section-label">{t("03 / GETTING AROUND")}</span>

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
    operator: "JR EAST",
    name: "Yamanote Line",
    color: "#73a94b",
    fare: "JR East fares vary by distance; 2026 Tokyo starting fares are ¥150 inside the Yamanote loop and ¥160 on trunk-line areas.",
    stations: ["Shibuya", "Harajuku", "Shinjuku", "Ikebukuro", "Ueno", "Akihabara", "Tokyo", "Shinagawa"],
    coords: [[35.6580,139.7016],[35.6702,139.7027],[35.6896,139.7006],[35.7295,139.7109],[35.7138,139.7770],[35.6984,139.7731],[35.6812,139.7671],[35.6285,139.7387],[35.6580,139.7016]],
  },
  {
    id: "ginza",
    operator: "TOKYO METRO",
    name: "Ginza Line",
    color: "#f0a400",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Omote-sando", "Ginza", "Nihombashi", "Ueno", "Asakusa"],
    coords: [[35.6580,139.7016],[35.6653,139.7120],[35.6717,139.7650],[35.6813,139.7739],[35.7138,139.7770],[35.7116,139.7967]],
  },
  {
    id: "asakusa",
    operator: "TOEI SUBWAY",
    name: "Asakusa Line",
    color: "#e94b45",
    fare: "Toei Subway uses distance-based fares; the Tokyo Subway Ticket also covers this line.",
    stations: ["Nishi-magome", "Ginza", "Nihombashi", "Asakusa", "Oshiage"],
    coords: [[35.5868,139.7056],[35.6717,139.7650],[35.6813,139.7739],[35.7116,139.7967],[35.7101,139.8107]],
  },
  {
    id: "hibiya",
    operator: "TOKYO METRO",
    name: "Hibiya Line",
    color: "#b5b5b5",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Naka-meguro", "Ebisu", "Roppongi", "Ginza", "Ueno", "Kita-senju"],
    coords: [[35.6440,139.6983],[35.6467,139.7101],[35.6628,139.7314],[35.6717,139.7650],[35.7138,139.7770],[35.7497,139.8050]],
  },
  {
    id: "marunouchi",
    operator: "TOKYO METRO",
    name: "Marunouchi Line",
    color: "#d93a3a",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shinjuku", "Shinjuku-sanchome", "Tokyo", "Otemachi", "Ikebukuro"],
    coords: [[35.6896,139.7006],[35.6909,139.7067],[35.6812,139.7671],[35.6862,139.7636],[35.7295,139.7109]],
  },
  {
    id: "hanzomon",
    operator: "TOKYO METRO",
    name: "Hanzomon Line",
    color: "#8c6bb1",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Omote-sando", "Aoyama-itchome", "Nagatacho", "Oshiage"],
    coords: [[35.6580,139.7016],[35.6653,139.7120],[35.6720,139.7238],[35.6786,139.7380],[35.7101,139.8107]],
  },
  {
    id: "fukutoshin",
    operator: "TOKYO METRO",
    name: "Fukutoshin Line",
    color: "#9a6b2f",
    fare: "Tokyo Metro IC: ¥178–¥324; paper ticket: ¥180–¥330 depending on distance.",
    stations: ["Shibuya", "Meiji-jingumae", "Shinjuku-sanchome", "Ikebukuro"],
    coords: [[35.6580,139.7016],[35.6695,139.7053],[35.6909,139.7067],[35.7295,139.7109]],
  },
  {
    id: "oedo",
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

function TrainMap({ activeLine }) {
  const t = useCopy();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: true }).setView([35.683,139.748], 12.2);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    stationPoints.forEach(([name, lat, lng]) => {
      L.circleMarker([lat,lng], { radius: 5, color: "#111", weight: 2, fillColor: "#f0eee8", fillOpacity: 1 })
        .bindTooltip(t(name), { direction: "top", offset: [0,-6] })
        .addTo(map);
    });
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const layers = [];
    transportLines.forEach((line) => {
      if (activeLine !== "ALL" && activeLine !== line.id) return;
      const layer = L.polyline(line.coords, {
        color: line.color,
        weight: activeLine === line.id ? 7 : activeLine === "ALL" ? 4 : 2,
        opacity: activeLine === line.id ? 0.95 : activeLine === "ALL" ? 0.62 : 0.18,
        lineJoin: "round",
      }).addTo(map);
      layers.push(layer);
    });
    return () => layers.forEach((layer) => map.removeLayer(layer));
  }, [activeLine]);

  return <div className="transport-map" ref={mapRef} />;
}

const routePlaces = ["Shibuya", "Asakusa", "Meiji Jingu", "Daikanyama", "Tokyo Skytree"];

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
        <span className="section-label">{t("07 / PLACES TO GO")}</span>
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
        <div className="section-label">{t("08 / SHOPPING")}</div>
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
                <span>0{index + 1} / 0{shoppingGuide.length} · {t(item.area)}</span>
                <h3>{t(item.focus)}</h3>
                <p>{t(item.text)}</p>
              </div>
            </SliderWrapper>
          ))}
        </SliderContent>
        <SliderBtnGroup>
          {shoppingGuide.map((item, index) => (
            <SliderBtn key={item.area} value={item.area} onSelect={setSelectedArea}>
              <span className="progressive-carousel__button-index">0{index + 1} / 0{shoppingGuide.length}</span>
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
  const t = useCopy();

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
      <Footer />
    </>
  );
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
          <div className="section-label">{t("01 / THE NETWORK")}</div>
          <div><h2>{t("KNOW")}<br /><span>{t("THE LINES.")}</span></h2><p>{t("JR East, Tokyo Metro, Toei Subway and private railways operate separate networks. The map below is a tourist-focused visual guide, not a live timetable.")}</p></div>
        </section>

        <section className="transport-map-section train-clean-map">
          <div className="transport-map-copy">
            <div className="section-label">{t("02 / RAIL MAP")}</div>
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
          <div className="section-label">{t("03 / FARES")}</div>
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
          <div className="section-label">{t("04 / FARE CALCULATOR")}</div>
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
          <div className="section-label">{t("05 / PAYMENT")}</div>
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

function ThingsToDo() {
  const t = useCopy();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const slides = [
    {
      image: "https://wallpaperaccess.com/full/259516.jpg",
      title: t("THINGS TO DO"),
      description: t("Find your own way through Tokyo."),
      meta: "TOKYO / 07 EXPERIENCES",
    },
    ...activities.map((activity) => ({
        image: activity.image,
        title: t(activity.title),
        description: t(activity.text),
        meta: `${t(activity.location)} / ${t(activity.hours)}`,
    })),
  ];
  return (
    <>
      <main className="activities-page activities-page--scroll">
        <ScrollGallery
          slides={slides}
          prefixLabel={t("TOKYO / EXPERIENCES")}
          scrollPerTransition={80}
          initialDelay={40}
          finalDelay={40}
          imageScale={1}
          className="things-to-do-scroll-gallery"
        />

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
  const tripTrackRef = useRef(null);
  const tripDragRef = useRef(null);
  const suppressTripClickRef = useRef(false);
  const activeTripIndexRef = useRef(0);
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
  const selectedTripRef = useRef(null);
  const carouselTrips = [...trips, ...trips, ...trips];
  const [activeTripIndex, setActiveTripIndex] = useState(trips.length);
  const closeTrip = () => setSelectedTrip(null);
  selectedTripRef.current = selectedTrip;
  activeTripIndexRef.current = activeTripIndex;
  const getTripSetWidth = (track) => {
    const firstCard = track.children[0];
    const nextSetCard = track.children[trips.length];
    return firstCard && nextSetCard ? nextSetCard.offsetLeft - firstCard.offsetLeft : 0;
  };
  const normalizeTripPosition = () => {
    const track = tripTrackRef.current;
    if (!track) return;
    const setWidth = getTripSetWidth(track);
    if (!setWidth) return;

    const offset = ((track.scrollLeft - setWidth) % setWidth + setWidth) % setWidth;
    track.scrollLeft = setWidth + offset;
  };
  const getCenteredTripIndex = (track) => {
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(track.children).forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - center);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    return closestIndex;
  };
  const handleTripScroll = (event) => {
    const track = event.currentTarget;
    const closestIndex = getCenteredTripIndex(track);

    if (closestIndex !== activeTripIndexRef.current) {
      activeTripIndexRef.current = closestIndex;
      setActiveTripIndex(closestIndex);
    }
  };
  useEffect(() => {
    const track = tripTrackRef.current;
    if (!track) return undefined;

    const setWidth = getTripSetWidth(track);
    track.scrollLeft = setWidth;
    let previousTime = 0;
    let animationFrame = 0;
    const advance = (time) => {
      if (previousTime && !tripDragRef.current && !selectedTripRef.current) {
        const elapsed = Math.min((time - previousTime) / 1000, 0.05);
        const loopWidth = getTripSetWidth(track);
        if (loopWidth) {
          track.scrollLeft += elapsed * 72;
          if (track.scrollLeft >= loopWidth * 2) track.scrollLeft -= loopWidth;
        }
      }
      previousTime = time;
      animationFrame = window.requestAnimationFrame(advance);
    };

    animationFrame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [trips.length]);
  const handleTripPointerDown = (event) => {
    if (event.button !== 0) return;
    const track = tripTrackRef.current;
    const card = event.target.closest(".faq-day-trip-card");
    if (!card || !track) return;

    tripDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
    };
    card.setPointerCapture(event.pointerId);
    track.classList.add("is-dragging");
  };
  const handleTripPointerMove = (event) => {
    const drag = tripDragRef.current;
    const track = tripTrackRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !track) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 5) drag.moved = true;
    if (drag.moved) {
      event.preventDefault();
      track.scrollLeft = drag.scrollLeft - deltaX;
    }
  };
  const handleTripPointerUp = (event) => {
    const drag = tripDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    tripDragRef.current = null;
    tripTrackRef.current?.classList.remove("is-dragging");
    normalizeTripPosition();
    if (drag.moved) {
      suppressTripClickRef.current = true;
      window.setTimeout(() => { suppressTripClickRef.current = false; }, 0);
    }
  };
  const handleTripClickCapture = (event) => {
    if (!suppressTripClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressTripClickRef.current = false;
  };

  return (
    <section className="faq-day-trips" id="day-trips">
      <div className="faq-day-trips__heading">
        <span className="section-label">{t("TOKYO / DAY TRIPS")}</span>
        <h2>{t("BEYOND")}<br /><span>{t("THE CITY.")}</span></h2>
        <p>{t("Six easy escapes when Tokyo calls for a different pace.")}</p>
      </div>
      <div
        ref={tripTrackRef}
        className="faq-day-trips__grid"
        onPointerDown={handleTripPointerDown}
        onPointerMove={handleTripPointerMove}
        onPointerUp={handleTripPointerUp}
        onPointerCancel={handleTripPointerUp}
        onScroll={handleTripScroll}
        onClickCapture={handleTripClickCapture}
      >
        {carouselTrips.map((trip, index) => (
          <motion.article
            className={`faq-day-trip-card${activeTripIndex === index ? " is-active" : ""}`}
            key={`${trip.title}-${index}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedTrip(trip)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedTrip(trip);
              }
            }}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (index % trips.length) * 0.12, ease: "easeOut" }}
          >
            <div className="faq-day-trip-card__image">
              <OptimizedImage src={trip.image} alt={t(trip.title)} loading="lazy" sizes="(max-width: 850px) 100vw, 50vw" />
            </div>
            <div className="faq-day-trip-card__copy">
              <span>{t(trip.subtitle)}</span>
              <h3>{t(trip.title)}</h3>
              <p>{t(trip.text)}</p>
            </div>
          </motion.article>
        ))}
      </div>
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
        <span className="section-label">{t("09 / TAX-FREE — UPDATED 2026")}</span>
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
            <span>{t("JAPAN / TOKYO")} · {photo.number} / 06</span>
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
        <p>{t("Use Hiragana across the site")}</p>
      </section>
      <main className="settings-page">
        <section className="language-setting">
          <div>
            <span className="section-label">{t("01 / LANGUAGE")}</span>
            <h2>{t("Interface language")}</h2>
            <p>{t("Switch the site's visible copy to Japanese written in Hiragana.")}</p>
          </div>
          <div className="language-options" role="group" aria-label={t("Interface language")}>
            <button type="button" aria-pressed={!enabled} className={!enabled ? "active" : ""} onClick={() => onSelectLanguage(false)}>{t("English")}</button>
            <button type="button" aria-pressed={enabled} className={enabled ? "active" : ""} onClick={() => onSelectLanguage(true)}>{t("Japanese")}</button>
          </div>
        </section>
        <p className="language-status" aria-live="polite">{enabled ? t("Hiragana is on") : t("English")}</p>
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
  const [hiragana, setHiragana] = useState(() => localStorage.getItem("tokyo-language") === "hiragana");
  const appCopy = (text) => hiragana ? hiraganaCopy[text] ?? text : text;

  useEffect(() => {
    localStorage.setItem("tokyo-language", hiragana ? "hiragana" : "en");
    document.documentElement.lang = hiragana ? "ja-Hira" : "en";
  }, [hiragana]);

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
    <HiraganaContext.Provider value={hiragana}>
    <>
      <div className={`route-wipe ${transitioning ? "is-active" : ""}`} aria-hidden={!transitioning}>
        {transitioning && <FlowerLoader />}
      </div>
      <Header onMenu={() => setMenuOpen((open) => !open)} onPlay={openMusicPlayer} path={path} menuOpen={menuOpen} />
      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} path={path} />
      <div className="route-stage" key={path}>
        <Routes path={path} onPlay={openMusicPlayer} musicActive={musicActive} hiragana={hiragana} onSelectLanguage={setHiragana} />
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
    </HiraganaContext.Provider>
  );
}

function Routes({ path, onPlay, musicActive, hiragana, onSelectLanguage }) {

  if (path === "/settings") {
    return <Settings enabled={hiragana} onSelectLanguage={onSelectLanguage} />;
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
