nodeLTS=$(curl -sL https://nodejs.org/download/release/index.tab | awk '($10 != "-" && NR != 1) { print $1; exit}')
installedNode=$(node -v)
echo "Node LTS" ${nodeLTS} " vs Installed ${installedNode}"
# TODO: fail build if version is to far outdated

# TODO: run 'npm outdated' to check that packages isn't to out of date

npm audit

ng lint

npx ng build --configuration=production

npx webpack --mode=production

# TODO: this could be expanded to show primary navigaiton vs back navigation plus more.
for r in $(find src/client/app -name "*-routing.module.ts"); do
    echo $r; grep "path:\|component:\|loadChildren:" $r;
    routeCount=$((routeCount + 1))
done
echo "Total route files:" ${routeCount};

#use --max_semi_space_size=2 --max_old_space_size=256 when running node