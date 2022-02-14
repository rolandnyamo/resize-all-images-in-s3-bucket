const aws = require("aws-sdk")
const s3 = new aws.S3()

const getFromS3 = async ({ bucket, key }) => {

    try {

        console.log('getting object from s3...')
        let obj = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise()

        console.log('object succesfully retrieved')

        return obj
    } catch (error) {
        console.log('error getting object from s3')
        console.log(error)
    }
}

const s3Put = async ({ bucket, key, body, type }) => {
    console.log("writing new image to s3")
    try {
        await s3.putObject({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: type
        }).promise()
    } catch (error) {
        console.log(error)
        throw new Error('error adding image to S3')
    }
}

const listS3Objects = async ({bucket}) => {

    try {
        let objects = await s3.listObjects({
            Bucket: bucket,
        }).promise()

        return objects
    } catch (error) {
        console.log('error getting object from s3')
        console.log(error)
    }
    
}

module.exports = {
    getFromS3,
    s3Put,
    listS3Objects
}