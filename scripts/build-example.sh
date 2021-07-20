# 必须在项目根目录执行
yarn install
yarn build
cd example
yarn install
cd ..
rm -rf example/node_modules/happykit
mkdir -p example/node_modules/happykit
cp -r lib example/node_modules/happykit/lib
cp package.json example/node_modules/happykit/
cp README.md example/node_modules/happykit/
cd example
yarn build
