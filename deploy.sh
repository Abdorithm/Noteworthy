echo "==> Switching to main branch"
git checkout main

echo "==> Building the project..."
npm run build

echo "==> Deploying the project..."
scp -r build/* abdo@98.67.164.128:/var/www/noteworthy.abdorithm.tech -i ~/.ssh/noteworthyhost_key.pem

echo "==> Deployment complete"