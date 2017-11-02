# Postman Collection 2.0 Importer for Paw

A [Paw Extension](https://paw.cloud/extensions) to import Postman Collection 2.0 files into Paw.

## How to use?

* In Paw, go to File menu, then Import...
* Pick the saved Postman Collection 2.0 file, and make sure the Format is "Postman Collection 2.0 Importer"

## Versions supported

* Postman 1.0 files: use instead [Postman v1 Importer (Paw)](https://paw.cloud/extensions/PostmanImporter)
* Postman 2.0 files: supported
* Postman 2.1 files: supported

## Development

⚠️ This project is entierly based on [API Flow](https://github.com/luckymarmot/API-Flow). This repository only containes the compiled file for this extension. Please refer to the *API Flow* repository for the orignal source code and for development.

The commands below refer to the *API Flow* project.

### Prerequisites

```shell
nvm install
yarn install
```

### Build and install to Paw

```shell
TARGET="postman2" make transfer
```

### Build for deployment

```shell
TARGET="postman2" make pack
```

## License

This Paw Extension is released under the [MIT License](https://github.com/luckymarmot/API-Flow/blob/develop/LICENSE). Feel free to fork, and modify!

Copyright © 2014-2017 [Paw](https://paw.cloud)
