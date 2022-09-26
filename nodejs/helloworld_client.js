const PROTO_PATH = '../protos/helloworld.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const routes = protoDescriptor.helloworld;

function main() {
    var greeter = new routes.Greeter('localhost:50051', grpc.credentials.createInsecure());
    var alb = new routes.ALB('localhost:50051', grpc.credentials.createInsecure());
    
    greeter.sayHello({name: 'Lee'}, function(err, response) {
        console.log('Greeting:', response.message);
    })
    
    alb.healthcheck({}, function(err, response) {
        console.log('healthcheck:', response.status);
    })
}
main()