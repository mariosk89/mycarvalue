import { rm } from "fs/promises";
import { join } from "path";

// Global before each - applies to all tests
global.beforeEach(async () => {
    try{
        // Delete the test database before every new test run
        await rm(join(__dirname, '..', 'test.sqlite'));
        console.log('deleted test.sqlite');
    }
    catch(err){

        console.log('could not delete test.sqlite');
    }
});