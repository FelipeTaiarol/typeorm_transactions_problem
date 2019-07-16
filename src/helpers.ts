export function promiseMock(): PromiseMock{
    const data = {
        resolve: undefined,
        reject: undefined,
        promise: undefined
    };
    const promise = new Promise((res, rej) => {
        data.resolve = function(data){
            res(data);
        }
        data.reject = function(err){
            rej(err);
        }
    });
    data.promise = promise;
    return data;
}

export interface PromiseMock{
    promise: Promise<any>,
    resolve: (data?: any) => any,
    reject: (err?: any) => any
}