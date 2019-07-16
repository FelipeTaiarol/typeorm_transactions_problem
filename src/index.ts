import { createConnection, EntityManager } from 'typeorm';
import { promiseMock } from './helpers';

async function getConnection(){
    const connection = await createConnection({
        type: "postgres",
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        schema: 'postgres',
        password: 'postgres',
        database: 'postgres',
        logging: 'all',
        entities: []
    });

    await connection.query(`
        DROP SCHEMA IF EXISTS test CASCADE;

        CREATE SCHEMA test;
    
        CREATE TABLE test.TEST( 
            "ID" serial,
            "TEST" NUMERIC
        )
    `);

    return connection;
}

async function start(){
    const conn = await getConnection();

    const queryRunner = conn.createQueryRunner();

    async function onFail(err: any){
        await queryRunner.rollbackTransaction();
        /** 
         * I was only able to reproduce it with this timeout, but given that the call above it is asynchronous it is enough to show that the race condition exists.
         */
        setTimeout(() => {
            console.log(`Releasing it now`);
            queryRunner.release();
        }, 200);
    }

    async function onSuccess(){
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    await queryRunner.startTransaction();

    startParallelExecution(queryRunner.manager, onSuccess, onFail);
}

function startParallelExecution(em: EntityManager, onSuccess: () => void, onFail: (err) => void): void{
    const promises = [];
    for(let i = 0; i < 10; i++){
        promises.push(execute(i, em, onFail));
    }
    Promise.all(promises).then(() => onSuccess());
}

async function execute(index: number, em: EntityManager, onFail: (err) => void){
    await wait(index * 100);
    if(index === 5){
        onFail(new Error('Error in javascript'));
    }else{
        return em.query(`INSERT INTO test.TEST ("TEST") VALUES ($1) `, [index]);
    }
}

function wait(ms: number){
    return new Promise((res, rej) => setTimeout(() => res(), ms));
}

start().then(() => console.log('done')).catch(err => {
    console.error(err);
});
