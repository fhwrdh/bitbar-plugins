# bitbar-plugins

Plugins for [bitbar](https://getbitbar.com).

## Installation

- clone the repo
- setup the plugins
- symlink to the configured bitbar plugin directory
  - rename to configure refresh time as per the bitbar [docs](https://github.com/matryer/bitbar#configure-the-refresh-time)

```bash
$ ~/bitbar
git clone git@github.com:fhwrdh/bitbar-plugins.git

$ ~/bitbar
cd bitbar-plugins/packages/stocker

$ ~/bitbar/bitbar-plugins/packages/stocker
npm install

$ ~/bitbar/bitbar-plugins/packages/stocker
cd ../../../

$ ~/bitbar
ln -s ./bitbar-plugins/packages/stocker/stocker.js ./stocker.5m.js

```
