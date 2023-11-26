# Changelog

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
