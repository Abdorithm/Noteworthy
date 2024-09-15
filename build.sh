# I run this file on my host VPS to deploy

# Store the PID of the existing node process
NODE_PID=$(pgrep -f node)

# Kill the node process
if [ -n "$NODE_PID" ]; then
    echo "===> Killing existing node process with PID: $NODE_PID"
    sudo kill $NODE_PID
else
    echo "===> No node process found to kill."
fi

echo "===> Removing old build..."
rm -rf build/

echo "===> Building new build..."
npm run build

echo "===> starting production server..."
npm start > ../log/output.log 2>&1 &