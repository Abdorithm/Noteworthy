# I run this file on my host VPS to deploy

# Update the repository
echo "===> Updating repository..."
echo ""
git stash
git checkout main
git pull

# Store the PID of the existing node process
NODE_PID=$(pgrep -f node)

# Kill the node process
if [ -n "$NODE_PID" ]; then
    echo "===> Killing existing node process with PID: $NODE_PID"
    echo ""
    sudo kill $NODE_PID
else
    echo "===> No node process found to kill."
    echo ""
fi

echo ""
echo "===> Removing old build..."
echo ""
rm -rf build/

echo ""
echo "===> Building new build..."
echo ""
npm run build

echo ""
echo "===> starting production server..."
npm start > ../log/output.log 2>&1 &