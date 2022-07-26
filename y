version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "websocket-stack-test"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-1xbxqjnu9ogd2"
s3_prefix = "websocket-stack-test"
region = "eu-west-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
disable_rollback = true
parameter_overrides = "TableName=\"simplechat_connections\" LanguageCode=\"en-GB\" InputS3BucketName=\"s3-lambda-transcribe-input-audio-build-testing\" OutputS3BucketName=\"s3-lambda-transcribe-output-text-build-testing\""
image_repositories = []
