// @flow

/**
 * Map for correcting show slugs.
 * @type {Object}
 */
const showMap: {
  [key: string]: string
} = {
  '10-oclock-live': '10-o-clock-live',
  '24-hours-in-aande': '24-hours-in-a-e',
  '24ch-la-serie': '24ch',
  '60-minutes-us': '60-minutes',
  '91-days': 'ninety-one-days',
  '999-whats-your-emergency': '999-what-s-your-emergency',
  'a-young-doctors-notebook': 'a-young-doctor-s-notebook',
  'accused-uk': 'accused',
  'ace-attorney': 'gyakuten-saiban',
  'ace-of-diamond': 'diamond-no-ace',
  'active-raid': 'active-raid-kidou-kyoushuushitsu-dai-hakkei',
  'ad-the-bible-continues': 'a-d-the-bible-continues-2015',
  'adam-devines-house-party': 'adam-devine-s-house-party',
  'after-paradise': 'bachelor-in-paradise-after-paradise-2015',
  'agatha-christies-partners-in-crime': 'agatha-christie-s-partners-in-crime',
  'ai-mai-mi-mousou-catastrophie': 'ai-mai-mi-mousou-catastrophe',
  'akagami-no-shirayukihime': 'akagami-no-shirayuki-hime',
  'akb0048': 'akb0048-first-stage',
  'alderamin-on-the-sky': 'nejimaki-seirei-senki-tenkyou-no-alderamin',
  'american-crime': 'american-crime-1969',
  'andrew-marrs-history-of-the-world': 'andrew-marr-s-history-of-the-world',
  'ani-tore-ex': 'anitore-ex',
  'argevollen': 'shirogane-no-ishi-argevollen',
  'arpeggio-of-blue-steel-ars-nova': 'aoki-hagane-no-arpeggio-ars-nova',
  'arslan-senki': 'kigyou-senshi-arslan',
  'arthur-and-george': 'arthur-george',
  'assassination-classroom': 'ansatsu-kyoushitsu',
  'b-project': 'b-project-kodou-ambitious',
  'bachelor-live': 'the-bachelor-live',
  'bad-education-uk': 'bad-education',
  'ballers-2015': 'ballers',
  'barabbas': 'barabbas-2013',
  'battle-girls-time-paradox': 'sengoku-otome-momoiro-paradox',
  'battlestar-galactica': 'battlestar-galactica-2003',
  'beach-eats-usa-with-curtis-stone': 'beach-eats-usa',
  'big-brother-us': 'big-brother-2000',
  'big-brothers-little-brother': 'big-brother-s-little-brother',
  'bikinis-and-boardwalks': 'bikinis-boardwalks',
  'black-box': 'the-black-box',
  'blackish': 'black-ish',
  'blazbluealter-memory': 'blazblue-alter-memory',
  'bobs-burgers': 'bob-s-burgers',
  'bonjour-sweet-love-patisserie': 'bonjour-koiaji-patisserie',
  'bonnie-and-clyde-2013': 'bonnie-clyde',
  'bordertown-2015': 'bordertown-2016',
  'bostons-finest': 'boston-s-finest',
  'bottom-biting-bug': 'oshiri-kajiri-mushi',
  'brad-neelys-harg-nallin-sclopio-peepio': 'brad-neely-s-harg-nallin-sclopio-peepio',
  'breathless-uk': 'breathless',
  'britains-got-more-talent': 'britain-s-got-more-talent',
  'britains-got-talent': 'britain-s-got-talent',
  'brooklyn-nine-nine': 'brooklyn-ninenine',
  'brooklyn-ninenine': 'brooklyn-nine-nine',
  'brotherhoodfinal-fantasy-xv': 'brotherhood-final-fantasy-xv',
  'brynhildr-in-the-darkness': 'gokukoku-no-brynhildr',
  'cant-pay-well-take-it-away': 'can-t-pay-well-take-it-away',
  'cardfight-vanguard-g-girs-crisis': 'cardfight-vanguard-g-gears-crisis-hen',
  'carol-kleins-plant-odysseys': 'carol-klein-s-plant-odysseys',
  'catastrophe-2008': 'catastrophe',
  'catherine-tates-nan': 'catherine-tate-s-nan',
  'celebrity-big-brother': 'celebrity-big-brother-2001',
  'chaos-dragon': 'chaos-dragon-sekiryuu-seneki',
  'charlie-brookers-screenwipe': 'charlie-brooker-s-weekly-wipe',
  'charlie-brookers-weekly-wipe': 'charlie-brooker-s-screenwipe',
  'charlies-angels-2011': 'charlie-s-angels-2011',
  'chicago-pd': 'chicago-p-d',
  'childrens-hospital-us': 'childrens-hospital',
  'concrete-revolutio': 'concrete-revolutio-choujin-gensou',
  'cooper-barretts-guide-to-surviving-life': 'cooper-barrett-s-guide-to-surviving-life-2016',
  'coopers-treasure': 'cooper-s-treasure',
  'cops-lac': 'cops-l-a-c',
  'cosmos-a-space-time-odyssey': 'cosmos-a-spacetime-odyssey',
  'cracked': 'cracked-2013',
  'craig-ferguson-the-late-late-show-with': 'the-late-late-show-with-craig-ferguson',
  'croisee-in-a-foreign-labyrinth': 'ikoku-meiro-no-croisee',
  'cross-ange': 'cross-ange-tenshi-to-ryuu-no-rinbu',
  'd.gray-man-hallow': 'd-gray-man-hallow',
  'da-vincis-demons': 'da-vinci-s-demons',
  'daimidaler': 'kenzen-robo-daimidaler',
  'dancing-with-the-stars-us': 'dancing-with-the-stars',
  'danganronpa-3-future-arc': 'danganronpa-3-the-end-of-kibougamine-gakuen-mirai-hen',
  'danganronpa-the-animation': 'danganronpa-kibou-no-gakuen-to-zetsubou-no-koukousei-the-animation',
  'danmachi': 'dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-no-darou-ka',
  'dara-o-briains-science-club': 'dara-o-briain-s-science-club',
  'david-attenboroughs-africa': 'africa-2013',
  'david-attenboroughs-conquest-of-the-skies': 'david-attenborough-s-conquest-of-the-skies',
  'dcs-legends-of-tomorrow': 'dc-s-legends-of-tomorrow',
  'dd-hokuto-no-ken-2-ichigo-aji-': 'dd-hokuto-no-ken-2-ichigo-aji',
  'detroit-187': 'detroit-1-8-7',
  'diabolik-lovers-more-blood': 'diabolik-lovers-2nd-season',
  'diamond-jubilee-concert-2012': 'the-diamond-jubilee',
  'dick-clarks-new-years-rockin-eve-with-ryan-seacrest': 'dick-clark-s-new-year-s-rockin-eve-with-ryan-seacrest',
  'digimon-adventure-tri': 'digimon-adventure-tri-4',
  'doll-and-em': 'doll-em',
  'dont-trust-the-b--in-apartment-23': 'don-t-trust-the-b-in-apartment-23',
  'duck-quacks-dont-echo-uk': 'duck-quacks-don-t-echo-2014-75919',
  'duets': 'duet-s',
  'dusk-maiden-of-amnesia': 'tasogare-otome-x-amnesia',
  'eastbound-and-down': 'eastbound-down',
  'ebiten': 'ebiten-kouritsu-ebisugawa-koukou-tenmonbu',
  'ellen-the-ellen-degeneres-show': 'ellen-the-ellen-degenere-s-show',
  'engaged-to-the-unidentified': 'mikakunin-de-shinkoukei',
  'fat-tony-and-co': 'fat-tony-co',
  'food-network-star': 'the-next-food-network-star',
  'forever-us-2014': 'forever-2014',
  'frankie-and-neffe': 'frankie-neffe',
  'franklin-and-bash': 'franklin-bash',
  'frys-planet-word-': 'frys-planet-word',
  'fuse-memoirs-of-the-hunter-girl': 'fuse-teppou-musume-no-torimonochou',
  'garo-the-animation': 'garo-honoo-no-kokuin-special',
  'garo-the-crimson-moon': 'garo-guren-no-tsuki',
  'garothe-crimson-moon': 'garo-guren-no-tsuki',
  'gate': 'gate-jieitai-kanochi-nite-kaku-tatakaeri',
  'gen-ei-o-kakeru-taiyou-il-sole-penetra-le-illusioni': 'genei-wo-kakeru-taiyou',
  'get-out-alive-2013': 'get-out-alive',
  'ghost-in-the-shell-arise-alternative-architecture': 'ghost-in-the-shell-arise-tv',
  'girl-friend-beta': 'girlfriend-kari',
  'gold-rush': 'gold-rush-2010',
  'gold-rush-alaska': 'gold-rush',
  'golden-boy': 'golden-boy-2013',
  'gordon-ramsays-ultimate-cookery-course': 'gordon-ramsay-s-ultimate-cookery-course',
  'gordons-great-escape': 'gordon-s-great-escape',
  'greys-anatomy': 'grey-s-anatomy',
  'gundam-reconguista-in-g': 'gundam-g-no-reconguista',
  'gundam-unicorn': 'mobile-suit-gundam-unicorn',
  'hackadoll-the-animation': 'hacka-doll-the-animation',
  'hakkenden-eight-dogs-of-the-east': 'hakkenden-touhou-hakken-ibun',
  'hakuoki-reimeiroku': 'hakuouki-reimeiroku',
  'hamatora': 'hamatora-the-animation',
  'hank': 'hank-2009',
  'harpers-island': 'harper-s-island',
  'harrys-law': 'harry-s-law',
  'haruchika': 'haruchika-haruta-to-chika-wa-seishun-suru',
  'hatfields-and-mccoys-2012': 'hatfields-mccoys',
  'hawaii-five-0-2010': 'hawaii-five-0',
  'hawaii-fiveo-2010': 'hawaii-five-0',
  'hayate-no-gotoku-cuties': 'hayate-the-combat-butler-cuties',
  'heartland-ca': 'heartland-2007-ca',
  'hells-kitchen-uk': 'hell-s-kitchen',
  'hells-kitchen-us': 'hell-s-kitchen-2005',
  'hemingway-and-gellhorn': 'hemingway-gellhorn',
  'hentai-ouji-to-warawanai-neko': 'hentai-ouji-to-warawanai-neko-specials',
  'hi-scoool-seha-girl': 'sega-hard-girls',
  'highschool-dxd-born': 'high-school-dxd-born',
  'hinterland-aka-y-gwyll': 'hinterland',
  'hit-and-miss': 'hit-miss',
  'hooten-and-the-lady': 'hooten-the-lady',
  'houdini-2014': 'houdini',
  'house-of-cards-2013': 'house-of-cards',
  'how-its-made': 'how-it-s-made',
  'how-its-made-dream-cars': 'how-it-s-made-dream-cars',
  'hozuki-no-reitetsu': 'hoozuki-no-reitetsu',
  'hughs-war-on-waste': 'hugh-s-war-on-waste',
  'hyperdimension-neptunia-the-animation': 'choujigen-game-neptune-the-animation',
  'im-sorry': 'i-m-sorry',
  'imocho-another-shitty-sister-ln-adaptation': 'saikin-imouto-no-yousu-ga-chotto-okashiin-da-ga',
  'infinite-stratos-2': 'is-infinite-stratos-2',
  'intelligence-us': 'intelligence-2014',
  'inu-x-boku-secret-service': 'inu-x-boku-ss',
  'iron-fist': 'marvel-s-iron-fist',
  'its-always-sunny-in-philadelphia': 'it-s-always-sunny-in-philadelphia',
  'james-mays-cars-of-the-people': 'james-may-s-cars-of-the-people',
  'jay-lenos-garage': 'jay-leno-s-garage',
  'jericho-2016': 'jericho-1969',
  'john-safrans-race-relations': 'john-safran-s-race-relations',
  'jonathan-strange-and-mr-norrell': 'jonathan-strange-mr-norrell',
  'k': 'k-project',
  'k-return-of-kings': 'k-2015',
  'kaasan-mom-s-life': 'mainichi-kaasan',
  'kabaneri-of-the-iron-fortress': 'koutetsujou-no-kabaneri',
  'kaiji-s2-against-all-rules': 'gyakkyou-burai-kaiji-hakairoku-hen',
  'kaiji-ultimate-survivor': 'gyakkyou-burai-kaiji-ultimate-survivor',
  'kamisama-kiss': 'kamisama-hajimemashita-kiss',
  'kamisama-kiss-2': 'kamisama-hajimemashita-2',
  'kamisama-no-memo-chou': 'kamisama-no-memochou',
  'karl-pilkington-the-moaning-of-life': 'k-michelle-my-life',
  'kateikyoushi-hitman-reborn': 'katekyo-hitman-reborn',
  'kath-and-kim': 'kath-kim',
  'kc-undercover': 'k-c-undercover',
  'key-and-peele': 'key-peele',
  'kims-convenience': 'kim-s-convenience',
  'kindaichi-case-files-r': 'kindaichi-shounen-no-jikenbo-returns',
  'king-and-maxwell': 'king-maxwell',
  'kirsties-handmade-christmas': 'kirstie-s-handmade-christmas',
  'kitchen-nightmares-us': 'kitchen-nightmares',
  'kmichelle-my-life': 'k-michelle-my-life',
  'kuroko-s-basketball': 'kuroko-no-basket',
  'kuroshitsuji-book-of-circus': 'black-butler-book-of-circus',
  'kyoukaisenjou-no-horizon': 'horizon-in-the-middle-of-nowhere',
  'la-corda-d-oro-blue-sky': 'kiniro-no-corda-blue-sky',
  'la-storia-della-arcana-famiglia': 'arcana-famiglia',
  'labyrinth-2013': 'labyrinth',
  'lance-n--masques': 'lance-n-masques',
  'last-man-standing-us': 'last-man-standing-2011',
  'late-night-with-conan-obrien': 'late-night-with-conan-o-brien',
  'law-and-order': 'law-order',
  'law-and-order-los-angeles': 'law-order-los-angeles',
  'law-and-order-special-victims-unit': 'law-order-special-victims-unit',
  'law-and-order-svu': 'law-order-special-victims-unit',
  'law-and-order-uk': 'law-order-uk',
  'legit': 'legit-2013',
  'lego-star-wars-the-freemaker-adventures': 'lego-star-wars-the-freemaker-adventures-113185',
  'lewis-blacks-the-root-of-all-evil': 'lewis-black-s-root-of-all-evil',
  'life-documentary': 'life-2009',
  'lifes-too-short-uk': 'life-s-too-short',
  'litchi-hikari-club': 'litchi-de-hikari-club',
  'little-witch-academia-the-enchanted-parade': 'little-witch-academia-2',
  'locodol': 'futsuu-no-joshikousei-ga-locodol-yatte-mita',
  'louie': 'louie-2010',
  'love-and-hip-hop': 'love-hip-hop',
  'love-and-hip-hop-atlanta': 'love-hip-hop-atlanta',
  'love-and-hip-hop-hollywood': 'love-hip-hop-hollywood',
  'love-live-the-school-idol-movie': 'love-live-school-idol-project-movie',
  'lucan-uk': 'lucan-2013',
  'lucas-bros-moving-company': 'lucas-bros-moving-co',
  'luck-&-logic': 'luck-logic',
  'lupin-iii-(2015)': 'lupin-iii',
  'mad-love-': 'mad-love',
  'magi': 'magi-the-labyrinth-of-magic',
  'magic-kaito-1412': 'magic-kaito-tv',
  'magical-girl-lyrical-nanoha-the-movie-2nd': 'mahou-shoujo-lyrical-nanoha-the-movie-2nd-a-s',
  'mahouka': 'mahouka-koukou-no-rettousei',
  'majestic-prince': 'ginga-kikoutai-majestic-prince',
  'majikoi~oh-samurai-girls': 'maji-de-watashi-ni-koi-shinasai',
  'mangaka-san-to-assistant-san-to': 'mangaka-san-to-assistant-san-to-the-animation',
  'maoyuu-maou-yuusha': 'maoyu',
  'maria-the-virgin-witch': 'junketsu-no-maria',
  'marvels-agent-carter': 'marvel-s-agent-carter',
  'marvels-agents-of-s-h-i-e-l-d': 'marvel-s-agents-of-s-h-i-e-l-d',
  'marvels-agents-of-shield': 'marvel-s-agents-of-s-h-i-e-l-d',
  'marvels-avengers-assemble': 'marvel-s-avengers-assemble',
  'marvels-daredevil': 'marvel-s-daredevil',
  'marvels-guardians-of-the-galaxy': 'marvel-s-guardians-of-the-galaxy',
  'marvels-jessica-jones': 'marvel-s-jessica-jones',
  'matador-us': 'matador-2014',
  'maya-and-marty': 'maya-marty',
  'mayday-uk-2013': 'mayday-2013',
  'mekakucity-actors': 'mekaku-city-actors',
  'melissa-and-joey': 'melissa-joey',
  'mike-and-molly': 'mike-molly',
  'million-dollar-listing': 'million-dollar-listing-los-angeles',
  'milo-murphys-law': 'milo-murphy-s-law',
  'mistresses-uk': 'mistresses-2008',
  'mondaijitachi-ga-isekai-kara-kuru-sou-desu-yo': 'problem-children-are-coming-from-another-world-aren-t-they',
  'moretsu-pirates': 'bodacious-space-pirates',
  'moritasan-wa-mukuchi': 'morita-san-wa-mukuchi',
  'mushibugyo': 'mushibugyou',
  'mushishi-tokubetsu-hen-hihamukage': 'mushishi-special-hihamukage',
  'my-sister-came-onee-chan-ga-kita': 'onee-chan-ga-kita',
  'naruto-sd-rock-lee-no-seishun-full-power-ninden': 'rock-lee-no-seishun-full-power-ninden',
  'naruto-shippuuden': 'naruto-shippuden',
  'never-mind-the-buzzcocks-uk': 'never-mind-the-buzzcocks',
  'newgameplus': 'new-game-plus',
  'nick-swardsons-pretend-time': 'nick-swardson-s-pretend-time',
  'ninja-slayer': 'ninja-slayer-from-animation',
  'no-rin': 'nourin',
  'no.-6': 'no-6',
  'non-non-biyori-repeat': 'non-non-biyori-2',
  'noukome': 'noucome-my-mental-choices-are-completely-interfering-with-my-school-romantic-comedy',
  'nuts-and-bolts': 'nuts-bolts',
  'okusama-ga-seitokaichou': 'okusama-ga-seitokaichou-okusama-gekijou',
  'oliver-stones-untold-history-of-the-united-states': 'oliver-stone-s-untold-history-of-the-united-states',
  'one-piece-3d2y': 'one-piece-3d2y-special',
  'one-week-friends': 'isshuukan-friends',
  'ore-twintail-ni-narimasu': 'ore-twintails-ni-narimasu',
  'parades-end': 'parade-s-end',
  'parasyte-the-maxim': 'kiseijuu',
  'paris-hiltons-british-best-friend': 'paris-hilton-s-british-best-friend',
  'penelope-keith-at-her-majestys-service': 'penelope-keith-at-her-majesty-s-service',
  'penn-and-teller-bullshit': 'penn-teller-bullshit',
  'penn-and-teller-fool-us': 'penn-teller-fool-us',
  'perception': 'perception-2012',
  'phi-brain': 'phi-brain-kami-no-puzzle',
  'photo-kano': 'photokano',
  'planetarian': 'planetarian-chiisana-hoshi-no-yume',
  'polar-bear-cafe': 'polar-bear-s-cafe',
  'polar-bear-family-and-me': 'the-polar-bear-family-me',
  'power-2014': 'power',
  'poyopoyo': 'poyopoyo-kansatsu-nikki',
  'prey-uk': 'prey-2014',
  'proof-us': 'proof',
  'puzzle-and-dragons-cross': 'puzzle-dragons-x',
  'raised-by-wolves-uk': 'raised-by-wolves',
  'ramsays-costa-del-nightmares': 'ramsay-s-costa-del-nightmares',
  'reckless': 'reckless-2014',
  'reckless-us': 'reckless-2014',
  'reign': 'reign-2013',
  'resurrection-us': 'resurrection-2014',
  'revolution-2012': 'revolution',
  'richard-hammonds-crash-course': 'richard-hammond-s-crash-course',
  'rizzoli-and-isles': 'rizzoli-isles',
  'ro-kyu-bu-fast-break': 'ro-kyu-bu',
  'robotics;notes': 'robotics-notes',
  'rowdy-sumo-wrestler-matsutaro': 'abarenbou-kishi-matsutarou',
  'rozen-maiden-(2013)': 'rozen-maiden-zuruckspulen',
  'ruby-and-the-rockits': 'ruby-the-rockits',
  'runs-house': 'run-s-house',
  'rush-us': 'rush-2014',
  'ryuugajou-nanana-no-maizoukin': 'ryuugajou-nanana-no-maizoukin-tv',
  'saekano': 'saenai-heroine-no-sodate-kata',
  'saf3-aka-rescue-3': 'saf3',
  'sailor-moon-crystal': 'bishoujo-senshi-sailor-moon-crystal',
  'saint-seiya-the-lost-canvas': 'saint-seiya-the-lost-canvas-meiou-shinwa',
  'sakamichi-no-apollon': 'kids-on-the-slope',
  'saki-episode-of-side-a': 'saki-achiga-hen-episode-of-side-a',
  'saki-the-nationals': 'saki-zenkoku-hen',
  'sanctuary-us': 'sanctuary',
  'satisfaction-us': 'satisfaction-2014',
  'scandal-us': 'scandal',
  'schitts-creek': 'schitt-s-creek',
  'scott-and-bailey': 'scott-bailey',
  'scott-baio-is-46and-pregnant': 'scott-baio-is-46-and-pregnant',
  'second-chance': 'second-chance-2016',
  'seisen-cerberus': 'seisen-cerberus-ryuukoku-no-fatalites',
  'seitokai-no-ichizon-lv.2': 'seitokai-no-ichizon-lv-2',
  'sengoku-musou-sanada-no-shou': 'sengoku-musou-sp-sanada-no-shou',
  'senki-zesshou-symphogear': 'senki-zesshou-symphogear-meteoroid-falling-burning-and-disappear-then',
  'senki-zesshou-symphogear-g': 'senki-zesshou-symphogear-g-in-the-distance-that-day-when-the-star-became-music',
  'senki-zesshou-symphogear-gx': 'senki-zesshou-symphogear-3',
  'seraph-of-the-end': 'owari-no-seraph',
  'seth-meyers-late-night-with': 'late-night-with-seth-meyers',
  'sexanddrugsandrockandroll': 'sex-drugs-rock-roll',
  'shadowhunters-the-mortal-instruments': 'shadowhunters',
  'she-and-her-cat': 'kanojo-to-kanojo-no-neko',
  'she-and-her-cat-everything-flows': 'kanojo-to-kanojo-no-neko-everything-flows',
  'shimoneta': 'shimoneta-to-iu-gainen-ga-sonzai-shinai-taikutsu-na-sekai',
  'shin-atashinchi': 'shin-atashin-chi',
  'shin-sekai-yori': 'shinsekai-yori',
  'shin-strange-': 'shin-strange',
  'shingeki-no-kyojin': 'attack-on-titan',
  'shit-my-dad-says': 'my-dad-says',
  'shokugeki-no-soma': 'shokugeki-no-souma',
  'shomin-sample': 'ore-ga-ojou-sama-gakkou-ni-shomin-sample-toshite-rachirareta-ken',
  'shounen-hollywood': 'shounen-hollywood-holly-stage-for-49',
  'so-i-can-t-play-h': 'dakara-boku-wa-h-ga-dekinai',
  'soniani-super-sonico-the-animation': 'super-sonico-the-animation',
  'space-brothers': 'uchuu-kyoudai',
  'space-dandy-2': 'space-dandy-2nd-season',
  'space-patrol-luluco': 'uchuu-patrol-luluco',
  'stan-lees-lucky-man': 'stan-lee-s-lucky-man',
  'startalk': 'startalk-with-neil-degrasse-tyson',
  'steins;gate': 'steins-gate',
  'stella-jogakuin-koutouka-c3-bu': 'stella-jogakuin-koutou-ka-c-bu',
  'stephen-fry-gadget-man': 'gadget-man',
  'steve-austins-broken-skull-challenge': 'prey-2014',
  'steve-harveys-funderdome': 'steve-harvey-s-funderdome',
  'straight-title-robot-anime': 'chokkyuu-hyoudai-robot-anime-straight-title',
  'strange-': 'strange',
  'suisei-no-gargantia': 'gargantia-on-the-verdurous-planet',
  'sukitte-ii-na-yo.': 'sukitte-ii-na-yo',
  'suprnova': 'supernova',
  'survivors-remorse': 'survivor-s-remorse',
  'talking-saul': 'talking-saul-2016',
  'taxi-brooklyn-us': 'axi-brooklyn',
  'teekyu': 'teekyuu',
  'teen-wolf': 'teen-wolf-2011',
  'thank-god-youre-here': 'thank-god-you-re-here',
  'the-bachelorette-australia': 'the-bachelorette-au',
  'the-black-box': 'black-box',
  'the-bridge-us': 'the-bridge-2013',
  'the-characters': 'netflix-presents-the-characters-2016',
  'the-chasers-war-on-everything': 'the-chaser-s-war-on-everything',
  'the-comedians-us': 'the-comedians-2015',
  'the-devils-whore': 'the-devil-s-whore',
  'the-directors-chair': 'the-director-s-chair',
  'the-disappearance-of-nagato-yuki-chan': 'nagato-yuki-chan-no-shoushitsu',
  'the-fosters': 'the-fosters-2013',
  'the-goldbergs': 'the-goldbergs-2013',
  'the-good-guys': 'the-good-guys-2010',
  'the-great-british-menu': 'great-british-menu',
  'the-gruffalos-child': 'the-gruffalo-s-child',
  'the-handmaids-tale': 'the-handmaid-s-tale',
  'the-hour-uk-2011': 'the-hour-2011',
  'the-idolm@ster': 'the-idolm-ster',
  'the-idolm@ster-cinderella-girls': 'the-idolm-ster-cinderella-girls',
  'the-kennedys-uk': 'the-kennedys-2015',
  'the-killing': 'the-killing-us',
  'the-killing-us': 'the-killing-2011',
  'the-knight-in-the-area': 'area-no-kishi',
  'the-la-complex': 'the-l-a-complex',
  'the-last-days-of-': 'the-last-days-of',
  'the-league': 'the-league-2009',
  'the-librarians-us': 'the-librarians-2014',
  'the-life-and-times-of-tim': 'the-life-times-of-tim',
  'the-magicians-us': 'the-magicians',
  'the-missing-us-and-uk': 'the-missing',
  'the-mole-us': 'the-mole-2001',
  'the-new-prince-of-tennis': 'new-prince-of-tennis',
  'the-new-prince-of-tennis-ova-vs-genius10': 'new-prince-of-tennis-ova-vs-genius10',
  'the-new-prince-of-tennis-specials': 'new-prince-of-tennis-specials',
  'the-office': 'the-office-us',
  'the-pilot-s-love-song': 'toaru-hikuushi-e-no-koiuta',
  'the-politicians-husband': 'the-politician-s-husband',
  'the-real-oneals': 'the-real-o-neals',
  'the-venture-brothers': 'the-venture-bros',
  'the-world-god-only-knows-goddesses-arc': 'the-world-god-only-knows-goddess-arc',
  'this-is-england-90': 'this-is-england-90-2015',
  'those-who-cant': 'those-who-can-t',
  'tim-and-erics-bedtime-stories': 'tim-and-eric-s-bedtime-stories',
  'time-travel-shoujo': 'time-travel-shoujo-mari-waka-to-8-nin-no-kagakusha-tachi',
  'tokyo-ghoul-root-a': 'tokyo-ghoul-2',
  'tonari-no-kaibutsu-kun': 'my-little-monster',
  'tosh0': 'tosh-0',
  'tracey-ullmans-show': 'tracey-ullman-s-show',
  'truth-and-iliza': 'truth-iliza',
  'tsukiuta.-the-animation': 'tsukiuta-the-animation',
  'twin-angel-twinkle-paradise': 'kaitou-tenshi-twin-angel-kyun-kyun-tokimeki-paradise',
  'unlimited-fafnir': 'juuou-mujin-no-fafnir',
  'up-all-night-2011': 'up-all-night',
  'usagi-drop': 'bunny-drop',
  'uta-no-prince-sama': 'uta-no-prince-sama-maji-love-1000',
  'uta-no-prince-sama-2': 'uta-no-prince-sama-maji-love-2000',
  'uta-no-prince-sama-revolutions': 'uta-no-prince-sama-maji-love-3',
  'utakoi': 'chouyaku-hyakuninisshu-uta-koi',
  'utopia-uk': 'utopia',
  'valvrave-the-liberator': 'kakumeiki-valvrave',
  'victoria-woods-nice-cup-of-tea': 'victoria-wood-s-nice-cup-of-tea',
  'vikings-us': 'vikings',
  'wabbit-a-looney-tunes-production': 'wabbit',
  'wake-up-girls-seven-idols': 'wake-up-girls-shichinin-no-idol',
  'wake-up-girls-zoo': 'wake-up-girl-zoo',
  'watamote': 'watashi-ga-motenai-no-wa-dou-kangaetemo-omaera-ga-warui',
  'watson-and-oliver': 'watson-oliver',
  'whodunnit-2013': 'whodunnit',
  'whose-line-is-it-anyway-us': 'whose-line-is-it-anyway-1998',
  'wooser-no-sono-higurashi-mugen-hen': 'wooser-no-sono-higurashi',
  'working': 'working-1',
  'xiii-the-series-2011': 'xiii-2011-34490',
  'yahari-ore-no-seishun-love-come-wa-machigatteiru': 'yahari-ore-no-seishun-love-comedy-wa-machigatteiru-ova',
  'yahari-ore-no-seishun-love-come-wa-machigatteiru-zoku': 'yahari-ore-no-seishun-love-comedy-wa-machigatteiru-zoku',
  'yama-no-susume-2': 'yama-no-susume-second-season-ova',
  'yamada-kun-and-the-seven-witches': 'yamada-kun-to-7-nin-no-majo',
  'yami-shibai-japanese-ghost-stories': 'yami-shibai',
  'yami-shibai-japanese-ghost-stories-2': 'yami-shibai-2nd-season',
  'yami-shibai-japanese-ghost-stories-3': 'yami-shibai-3rd-season',
  'young-and-hungry': 'young-hungry',
  'young-herriot': 'young-james-herriot',
  'youre-the-worst': 'you-re-the-worst',
  'youre-the-worst-2014': 'you-re-the-worst',
  'yuki-yuna-wa-yusha-de-aru': 'yuuki-yuuna-wa-yuusha-de-aru',
  'yurumate3dei': 'yurumates-3d',
  'yuruyuri': 'yuru-yuri',
  'yuushibu': 'yuusha-ni-narenakatta-ore-wa-shibushibu-shuushoku-wo-ketsui-shimashita',
  'zero-hour-us': 'zero-hour-2013',
  'zero-no-tsukaima-final': 'zero-no-tsukaima-f',
  'zx-ignition': 'z-x-ignition',
}

/**
 * Export the movie map.
 * @type {Object}
 */
export default showMap
