nv=$(curl -sL https://nodejs.org/download/release/index.tab | awk '($10 != "-" && NR != 1) { print $1; exit}')
echo "Node LTS" ${nv}
# TODO: fail build if version is to far outdated

# TODO: run 'npm outdated' to check that packages isn't to out of date

npm audit

ng lint

npx ng build --configuration=production

npx webpack --mode=production