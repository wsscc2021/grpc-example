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

function sayHello(call, callback) {
    console.log(call.request);
    callback(null, {message: 'Hello, ' + call.request.name});
}

function healthcheck(call, callback) {
    callback(null, {status: 'ok'});
}

function main() {
    var server = new grpc.Server();
    server.addService(
        routes.Greeter.service, {
            sayHello
        }
    );
    server.addService(
        routes.ALB.service, {
            healthcheck
        }
    );
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    })
}

main()