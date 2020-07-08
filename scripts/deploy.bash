stage-$1

if [[ -z $stage ]]
then
    stage="test"
fi

echo "Deploying to $stage..."

sls deploy additionalstacks --stage $stage -v

sls deploy --stage $stage -v

echo "Finished Deployment."