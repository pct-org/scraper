## [3.1.2](https://github.com/pct-org/scraper/compare/v3.1.1...v3.1.2) (2020-04-26)


### Bug Fixes

* Adde default values for downloadQuality ([f16a4bb](https://github.com/pct-org/scraper/commit/f16a4bb5b821492ab6809f6d12a3bc7129ebc559))



## [3.1.1](https://github.com/pct-org/scraper/compare/v3.1.0...v3.1.1) (2020-04-26)


### Bug Fixes

* Fixes in mongo models ([e75ac36](https://github.com/pct-org/scraper/commit/e75ac367c5d088dea86ace177194ee3d257cce32))



# [3.1.0](https://github.com/pct-org/scraper/compare/65d233e1b7f719543c42502353a69136fc4c0407...v3.1.0) (2020-04-26)


### Bug Fixes

* Algin all images to be the same ([e40c40d](https://github.com/pct-org/scraper/commit/e40c40df313a5b8798ec5daf855606a16ff1dca9))
* Do not crash when status / updated file does not exist ([24cd5ad](https://github.com/pct-org/scraper/commit/24cd5ad56ac8e0016af49ca056d1a6ebd781e0bc))
* Don't overwrite the download stats ([cecd63a](https://github.com/pct-org/scraper/commit/cecd63a46394ad0fd35eaa4983afa6be69c26b55))
* Fix api for pop-ap@0.1.0 ([e2d7931](https://github.com/pct-org/scraper/commit/e2d7931e56783b81384240515d4c6e6a094999c5))
* fix appveyor shield ([0325cec](https://github.com/pct-org/scraper/commit/0325cec358470f444d174a774e067c15a93ed3cb))
* Fix build with rollup commonjs ([0f2e739](https://github.com/pct-org/scraper/commit/0f2e739ca22853c5726836d022d2567dd3ee76d0))
* Fix running dredd and mocha tests ([ce14d34](https://github.com/pct-org/scraper/commit/ce14d348a882057328f7c479752a21edffcc8409))
* Fix tests for synopsis searching ([e8a58b3](https://github.com/pct-org/scraper/commit/e8a58b3e10d516c54ff95ad8948f621b894124e7))
* Fixed cron not working, fixed linting ([3a1713f](https://github.com/pct-org/scraper/commit/3a1713f41190622df967f57b224e924e76054f64))
* Fixed magnet undefined for Zoooqle provider ([1bb6610](https://github.com/pct-org/scraper/commit/1bb661017c0948871d53f169ddea3f83cfa9af9b))
* Fixed movieProvider not merging torrents correctly ([c6de27b](https://github.com/pct-org/scraper/commit/c6de27b806eca6920cacd9dd14c86deae709befc))
* Fixed order of torrents not being correct ([e79210a](https://github.com/pct-org/scraper/commit/e79210aaaa0760207cc13a054b3d8f1a955c9d3c))
* Fixed that /movies returned /movie/1 instead of /movies/1 ([907a5a1](https://github.com/pct-org/scraper/commit/907a5a196ff9c7a9ba3f1865ffe09d15097f85f2))
* Fixed that BaseProvider did not catch when content was not found and then stopt looping true the rest of the items ([894bbbc](https://github.com/pct-org/scraper/commit/894bbbce5a57f1020a3e727e649dbf2756d4727f))
* Fixed that blacklisted show items where not reconised ([09a2fe4](https://github.com/pct-org/scraper/commit/09a2fe4de0300ee26e0793cb2bdf13e5d82bdac1))
* Fixed that cron errors ([fa1d3db](https://github.com/pct-org/scraper/commit/fa1d3db0bc8aea3805b11f0f277e43d36ca9fcfe))
* Fixed that episodes did not have a title ([da0eedf](https://github.com/pct-org/scraper/commit/da0eedfd444846d55a97f5f87baf12b1fb95d482))
* Fixed that s was undefined ([64d69fe](https://github.com/pct-org/scraper/commit/64d69fe19df152291c7864c7e0bb4c14aef9d485))
* Fixed that the /logs/error did not work ([b639464](https://github.com/pct-org/scraper/commit/b639464bda56a649cca95bebe6564dd5e122bfed))
* Fixed that two torrents of the same quality could be added and that seasons where never a match when updating existing show ([c4a6b09](https://github.com/pct-org/scraper/commit/c4a6b097c7a80b8995f5496c22e22f70ad498445))
* Fixed the content models ([fd79367](https://github.com/pct-org/scraper/commit/fd79367b3793885752a5e36f52a4a97b6a337e4a))
* Fixed tmdb errors ([2228b4a](https://github.com/pct-org/scraper/commit/2228b4af245f2815635673e15a7f6e48980ada76))
* Fixed type for nextEpisodeAirs ([c3bb3ff](https://github.com/pct-org/scraper/commit/c3bb3ff4ec37014ce374209c752cdecf9d66cbe3))
* Fixes for tmdb images ([a5a9010](https://github.com/pct-org/scraper/commit/a5a90107c48f8b6fe31c3aaa9e713411071d9af2))
* Flow  now works with mongoose models ([09e8b8e](https://github.com/pct-org/scraper/commit/09e8b8ecb3d8713f518c956e480783c788b84401))
* Get the total amount of pages ([ade14ef](https://github.com/pct-org/scraper/commit/ade14ef43384953d503faa64dff434d1712b465e))
* If one page of yts crashes don't let it stop ([7e6026c](https://github.com/pct-org/scraper/commit/7e6026c1d85219f41967ed31b45b25f93e815d1e))
* Made a lot of fixes so we have a working version again ([e742afb](https://github.com/pct-org/scraper/commit/e742afb36e034c7933837b0d0e399a5cfd8278c5))
* Prefer the imdb id above a slug ([86b5eb5](https://github.com/pct-org/scraper/commit/86b5eb57617a13f1771d79307600b275a22d60d9))
* Removed empty return ([777a379](https://github.com/pct-org/scraper/commit/777a379d5535703ea243e8ddf18181e92293b513))
* Small fixes and improvements for Zoooqle ([16cf7dd](https://github.com/pct-org/scraper/commit/16cf7dd9a6a688734fa6e92c145c49814dc44cfc))
* Small fixes and update eztv api ([55cc8ca](https://github.com/pct-org/scraper/commit/55cc8ca89d8ba6399a45c592b2b43b6e0bff4a41))
* Small fixes for getting started ([2ec7a23](https://github.com/pct-org/scraper/commit/2ec7a23c9947edcd1f435e20016db225fa2c5ede))
* Use cron time from env ([bfc0620](https://github.com/pct-org/scraper/commit/bfc0620a3751240413cb691800ebcda6adbf8823))
* **flow:** Fix flow config for windows ([a93743a](https://github.com/pct-org/scraper/commit/a93743a20eb3d40246a51dde7588b30c58f17fbf))
* **flow:** Make flow tests pass ([53c4c5b](https://github.com/pct-org/scraper/commit/53c4c5b4a592132905e07c34b882d5d89345cab5))
* **models:** Fix where animeshow and show would be the same ([ac135a8](https://github.com/pct-org/scraper/commit/ac135a877a5fdfd0e031dfb70d733a4758da8ccb))
* **pop-api-scraper:** Fix where status files would be empty ([ebcd4e5](https://github.com/pct-org/scraper/commit/ebcd4e5cab7a38f42252d45b26ad655db350e200))
* **shows:** Fixed that /shows and /shows/{page} did not work and disabled show provider for now ([b448f3c](https://github.com/pct-org/scraper/commit/b448f3cca7fc087c3de41426abba946cd829ea5d))


### Features

* Add images sizes to all images ([20679ed](https://github.com/pct-org/scraper/commit/20679ed6571f220975730b7229df86e4b48f54e9))
* Add improved runtimes and amount of stars for rating ([47fe34a](https://github.com/pct-org/scraper/commit/47fe34a67476565f517fa40491028854a98af449))
* Add issue and pr templates ([04e95d9](https://github.com/pct-org/scraper/commit/04e95d9f1e8090a7db8c8c0b4e55642eb74cf67e))
* Add latestEpisodeAired to shows ([25f2f0b](https://github.com/pct-org/scraper/commit/25f2f0b934642609bb16da6bb18ba3e1c5aed66f))
* Add support for appveyor ([04cc12f](https://github.com/pct-org/scraper/commit/04cc12fd505cea8444181832bc9fd2cfae48c76f))
* Add support for standard-version ([8d3efce](https://github.com/pct-org/scraper/commit/8d3efce56ce3726f9066fc4b0c5c713dcf6a9f09))
* Added blacklist logic ([903f5f5](https://github.com/pct-org/scraper/commit/903f5f5fd888eb4611ff353364f46edc414e7bff))
* Added config for ettv ([f4224dd](https://github.com/pct-org/scraper/commit/f4224dd62fa22d98e84a89af76c4b04a1dd44333))
* Added default download to movie and episode ([c098bbe](https://github.com/pct-org/scraper/commit/c098bbe4dacafcf820a1c9605ecd0ac5a7dcacb1))
* Added fallback methods ([68c0e81](https://github.com/pct-org/scraper/commit/68c0e8150e60b0775b9a6a481a5af738d69babcf))
* Added improved watched ([4afd974](https://github.com/pct-org/scraper/commit/4afd974bf727ec1ad474e2861a13ace9ba0a6d68))
* Added KatMovieProvider with UHD support ([297b8d3](https://github.com/pct-org/scraper/commit/297b8d3f64f28097204ba6bdcab9775d02a45230))
* Added KatTv provider ([df45050](https://github.com/pct-org/scraper/commit/df450507902e0381edf364f616e325e52cb87695))
* Added last_updated to movies ([ee85892](https://github.com/pct-org/scraper/commit/ee858924f3da458eb6465acdd939bb3ad5f78673))
* Added logo to images ([5b5d54e](https://github.com/pct-org/scraper/commit/5b5d54edc6b3c5c349a17048802388ec810f4c8c))
* Added SolidTorrents for UHD shows and movies ([c9a9f4f](https://github.com/pct-org/scraper/commit/c9a9f4f5c0b163f8ed8245c818ac01f1d50ec16b))
* Added title to blacklisted items ([3f2f3a7](https://github.com/pct-org/scraper/commit/3f2f3a7b53d73baa5f74d39dd8fadf937001688e))
* Added trailerId ([4eb9663](https://github.com/pct-org/scraper/commit/4eb966377c287f34f6dd5d6661c23142b1b44321))
* Added Zoooqle provider for 4k ([378735c](https://github.com/pct-org/scraper/commit/378735ceb332423e9861b3834c1f6a726f5795cb))
* Also add active series to the blacklist until the next episode ([7ac630e](https://github.com/pct-org/scraper/commit/7ac630ed2b94f7629aa07fb8c301df68c7a04e0c))
* Build with rollupjs ([957b61d](https://github.com/pct-org/scraper/commit/957b61d945790dde13d1b9fbdeb72c0c286336cd))
* Everything is crawling again ([af05d2c](https://github.com/pct-org/scraper/commit/af05d2cfb80252706702b35b91b5ca8f06661241))
* Improve the way we retrieve images ([4c2bf71](https://github.com/pct-org/scraper/commit/4c2bf71e49db3693bbc0ec6a9534b937924a32c7))
* Only schedule the cron not directly start it ([be547d9](https://github.com/pct-org/scraper/commit/be547d90432ea368ee056fc2baeb00d74afbeeac))
* Text indexes search (@MrcRjs) ([f1e8fd2](https://github.com/pct-org/scraper/commit/f1e8fd2881280726df39715b688fa27c6b09c622))
* Updated showMap with more slugs ([bedb6ab](https://github.com/pct-org/scraper/commit/bedb6abc1ee57d4f74f7e60f08534fd0b344856e))


### Reverts

* Revert "second option movie trailer null" ([65d233e](https://github.com/pct-org/scraper/commit/65d233e1b7f719543c42502353a69136fc4c0407))



