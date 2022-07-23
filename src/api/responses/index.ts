import express from "express";
import forbidden from './forbidden';
import tokenError from './tokenError';
import apiError from './apiError';

class Responses {
    public static init() {

        express.response["forbidden"] = forbidden;
        express.response["tokenError"] = tokenError;
        express.response["apiError"] = apiError;


    }
}

export default Responses;