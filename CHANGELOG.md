# Changelog

## [1.11.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.11.0...v1.11.1) (2023-12-18)


### Bug Fixes

* add body schema in order plugin ([6f4c38a](https://github.com/ngyngcphu/tick3d-be/commit/6f4c38a9eda0b618bdfbcaed79a0f35593e94fee))
* add type for params ([004981b](https://github.com/ngyngcphu/tick3d-be/commit/004981b450ae46bb2368174aadb0f138ab484faf))
* add update order api and return items detail in getOrderById ([4dbd17f](https://github.com/ngyngcphu/tick3d-be/commit/4dbd17f67a5650893c5436ffa55753b0ea746a52))

## [1.11.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.10.0...v1.11.0) (2023-12-18)


### Features

* add api to delete and reset cart ([a3133f2](https://github.com/ngyngcphu/tick3d-be/commit/a3133f2ecdf38b59b621bcf547438596dc3ea0ec))

## [1.10.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.9.3...v1.10.0) (2023-12-18)


### Features

* order support query string ([d6201de](https://github.com/ngyngcphu/tick3d-be/commit/d6201dec61c0c184fa481a6f61a4575441c98cdd))


### Bug Fixes

* default model start query param constraint ([4c6ef31](https://github.com/ngyngcphu/tick3d-be/commit/4c6ef31df3b65b3021a7e092eb4470af39460515))
* make userModel getAll more robust ([4cc5246](https://github.com/ngyngcphu/tick3d-be/commit/4cc52463ae4f7c8820da3acea990a27d4adfabfa))
* userModel suppoer query string ([f48b334](https://github.com/ngyngcphu/tick3d-be/commit/f48b334b90f82a26c570f1e2c6f38357a05395bd))

## [1.9.3](https://github.com/ngyngcphu/tick3d-be/compare/v1.9.2...v1.9.3) (2023-12-18)


### Bug Fixes

* clear tokenCookie upon entering login api ([cb6d514](https://github.com/ngyngcphu/tick3d-be/commit/cb6d514d4c29f3618b55d58bc4e26bec943ba9be))

## [1.9.2](https://github.com/ngyngcphu/tick3d-be/compare/v1.9.1...v1.9.2) (2023-12-18)


### Bug Fixes

* properly make the seeded user verified ([7548e1f](https://github.com/ngyngcphu/tick3d-be/commit/7548e1f7d64d272198dd6f01a1f1a8dc41ee45e9))
* support ordering on boughtAmount field ([d2e020d](https://github.com/ngyngcphu/tick3d-be/commit/d2e020de9c0839654c3baa6f5d016228c4b49312))

## [1.9.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.9.0...v1.9.1) (2023-12-18)


### Bug Fixes

* make getAll more robust ([7dffe10](https://github.com/ngyngcphu/tick3d-be/commit/7dffe106bff169861f9df975cda91db605dad2ac))

## [1.9.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.8.0...v1.9.0) (2023-12-18)


### Features

* add search, filter, pagination support for default model ([cdb6345](https://github.com/ngyngcphu/tick3d-be/commit/cdb63452bf330aa0413f817e1c92438c3657911d))


### Bug Fixes

* slides can be pulled by anyone ([1573c63](https://github.com/ngyngcphu/tick3d-be/commit/1573c63c56bef6cb2030e1d3b64cfb181a96964c))

## [1.8.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.7.0...v1.8.0) (2023-12-18)


### Features

* add apis for viewing orders ([545b625](https://github.com/ngyngcphu/tick3d-be/commit/545b6252b27a80efd38994f0522bfa84e4c978c0))


### Bug Fixes

* signup did not add to Customer relation ([a361e65](https://github.com/ngyngcphu/tick3d-be/commit/a361e65f3c5176fd15aec5dde7bba289ba629f8f))

## [1.7.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.6.2...v1.7.0) (2023-12-18)


### Features

* **seed.ts:** increase number of mock data using faker.js ([672cbef](https://github.com/ngyngcphu/tick3d-be/commit/672cbef76fc465fc347a9ffdfbdb8d8a6cdc5db3))

## [1.6.2](https://github.com/ngyngcphu/tick3d-be/compare/v1.6.1...v1.6.2) (2023-12-18)


### Bug Fixes

* add types declaration for otp-generator ([05117e3](https://github.com/ngyngcphu/tick3d-be/commit/05117e380e5bbd864b13785f568876c078531acc))
* verification flow ([699d8af](https://github.com/ngyngcphu/tick3d-be/commit/699d8af81c67068ff80d07df579806a8345fb2f3))

## [1.6.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.6.0...v1.6.1) (2023-12-18)


### Bug Fixes

* allow normal user to get user by id ([bde485a](https://github.com/ngyngcphu/tick3d-be/commit/bde485a4c4c86fbfdbb37ce73274cdb3fa594f41))

## [1.6.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.5.0...v1.6.0) (2023-12-08)


### Features

* add toggle-like api ([bd563da](https://github.com/ngyngcphu/tick3d-be/commit/bd563da773c25e2d199ae5e5c02e71e0b2c075e6))


### Bug Fixes

* bugs related to model api ([b0cdb72](https://github.com/ngyngcphu/tick3d-be/commit/b0cdb7281b42b44c8bb340c418ed238eeae268b7))
* default model api ([e8533fb](https://github.com/ngyngcphu/tick3d-be/commit/e8533fb5e56d2578eea425e47998a5283376a36a))
* prisma schema ([1daa05c](https://github.com/ngyngcphu/tick3d-be/commit/1daa05cca56fb21d9af148dd277504e3e82df564))
* remove redundant migration ([4edcb12](https://github.com/ngyngcphu/tick3d-be/commit/4edcb121d7da8a5caf0207c0a0c927bbf6302417))

## [1.5.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.4.2...v1.5.0) (2023-11-29)


### Features

* adapt to the latest commit ([29fa9d1](https://github.com/ngyngcphu/tick3d-be/commit/29fa9d17e852bcc541b3d8a6034aaeeebb4965b9))

## [1.4.2](https://github.com/ngyngcphu/tick3d-be/compare/v1.4.1...v1.4.2) (2023-11-27)


### Bug Fixes

* add to manager & customer table along with user ([81a420c](https://github.com/ngyngcphu/tick3d-be/commit/81a420cf2dbb4e9132ff7c1b48c01654eff7e697))
* modal typo ([b035202](https://github.com/ngyngcphu/tick3d-be/commit/b035202f784618d28cbf8bae38754392c2dadfc4))

## [1.4.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.4.0...v1.4.1) (2023-11-26)


### Bug Fixes

* **cd:** correct addition of CHECKOUT_ENVIROMENT to .env ([8a5c273](https://github.com/ngyngcphu/tick3d-be/commit/8a5c27342ea148966a8df239937691a8bbece44b))

## [1.4.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.3.0...v1.4.0) (2023-11-26)


### Features

* **home:** implement API to retrieve home slide images from Minio server ([20276f5](https://github.com/ngyngcphu/tick3d-be/commit/20276f51282e7e04d59c6b5cf625bf8443ed83fa))
* **model:** implement Api for fetch all default models for the homapage ([04dd059](https://github.com/ngyngcphu/tick3d-be/commit/04dd05978da78b47a2b1e6be2132eca2255489d7))


### Bug Fixes

* **cd:** add missing environment variables in release; improve readability ([11fc9e3](https://github.com/ngyngcphu/tick3d-be/commit/11fc9e3dad25f349520f5cf67ac47748a255bd82))

## [1.3.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.2.1...v1.3.0) (2023-11-26)


### Features

* **checkout:** create API for generating orders in the checkout process ([488170e](https://github.com/ngyngcphu/tick3d-be/commit/488170e5dee6417c64786599da51daa2ecdf84c9))


### Bug Fixes

* **cd:** remove volume when deploy new version ([e89e5f2](https://github.com/ngyngcphu/tick3d-be/commit/e89e5f2fbd73c54988e29e193f2544661b625318))

## [1.2.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.2.0...v1.2.1) (2023-11-26)


### Bug Fixes

* **logout:** change POST method to DELETE method ([9cda5c8](https://github.com/ngyngcphu/tick3d-be/commit/9cda5c8010014463fece6ba0911054ede048ae64))

## [1.2.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.1.0...v1.2.0) (2023-11-25)


### Features

* add cart api ([5477b7a](https://github.com/ngyngcphu/tick3d-be/commit/5477b7a273fa12843c25e748430fc9abc99323a8))

## [1.1.0](https://github.com/ngyngcphu/tick3d-be/compare/v1.0.3...v1.1.0) (2023-11-23)


### Features

* add email verification ([588f50a](https://github.com/ngyngcphu/tick3d-be/commit/588f50a529c7bbabec3ba8e559555ecea848d945))
* add prisma schema ([36201b2](https://github.com/ngyngcphu/tick3d-be/commit/36201b20aec82de089e630862fb7f73012d7de68))
* run db migrations ([e874d58](https://github.com/ngyngcphu/tick3d-be/commit/e874d58cd8a1d10690c5796795d1294b67151514))


### Bug Fixes

* auth now uses the new schema ([33b2d28](https://github.com/ngyngcphu/tick3d-be/commit/33b2d28c243cb7f9f54448a819db0f6c094efbbe))
* **auth:** adapt to the new schema ([95e3ecc](https://github.com/ngyngcphu/tick3d-be/commit/95e3ecce11e71a0d45bc855a95c5d83b031049a5))
* **auth:** missed cases when adapt code to new schema ([599e7c6](https://github.com/ngyngcphu/tick3d-be/commit/599e7c69e7dcbd5e03ba90bbbe97dc455ab9cff8))
* **prisma:** change account_name to email in user model ([3e2eeba](https://github.com/ngyngcphu/tick3d-be/commit/3e2eeba89205d85651d6f19010cd145629d1221c))
* **prisma:** semantic errors in schema file ([e00b5d4](https://github.com/ngyngcphu/tick3d-be/commit/e00b5d4cfb3d76a9cc3b82ac31fa34e342f1c5a3))
* **schema:** split profile name ([761e1e4](https://github.com/ngyngcphu/tick3d-be/commit/761e1e486a1e33f8d77188a3b7342c022e7952e1))
* seeder ([6742a51](https://github.com/ngyngcphu/tick3d-be/commit/6742a519125d313a469e76172dd5877675798d3f))

## [1.0.3](https://github.com/ngyngcphu/tick3d-be/compare/v1.0.2...v1.0.3) (2023-09-29)


### Bug Fixes

* **docker:** mapping port for postgres_tick3d in docker-compose.yml ([6ef0ca1](https://github.com/ngyngcphu/tick3d-be/commit/6ef0ca183e1ca20a0831b21c5c149d61d9838a43))

## [1.0.2](https://github.com/ngyngcphu/tick3d-be/compare/v1.0.1...v1.0.2) (2023-09-29)


### Bug Fixes

* **package:** rename action build and push ([a48ad9b](https://github.com/ngyngcphu/tick3d-be/commit/a48ad9b7a2fd66d880987f1dca33fe4b52cd4500))

## [1.0.1](https://github.com/ngyngcphu/tick3d-be/compare/v1.0.0...v1.0.1) (2023-09-29)


### Bug Fixes

* **description:** add line 3D Printing Service ([01c56b0](https://github.com/ngyngcphu/tick3d-be/commit/01c56b0eda2568796cdb9f2a383e209deb0d110a))

## 1.0.0 (2023-09-29)


### Features

* **authorization:** enable two roles: user and admin ([e571a5b](https://github.com/ngyngcphu/tick3D-be/commit/e571a5b510e186130d9158477d978a282dd0f22d))
