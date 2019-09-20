export default {
    // host: (process.env.NODE_ENV === 'integration' ? 'http://localhost:9200' : process.env.ELASTICSEARCH_HOST || 'http://vpc-ictplustest-ci4hdrpuv4gyepev3khzfo7eoa.ap-southeast-2.es.amazonaws.com'),
    host: process.env.ELASTICSEARCH_HOST || 'http://vpc-ictplustest-ci4hdrpuv4gyepev3khzfo7eoa.ap-southeast-2.es.amazonaws.com',
    log: process.env.ELASTICSEARCH_LOG 	|| 'error',
    max_size: 10000
}