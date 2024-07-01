"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMyUserRequest = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); //this means that fn is pase d to controller fn such tha tu c an udate the user profile mate 
});
exports.validateMyUserRequest = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Name must b a string"),
    (0, express_validator_1.body)("addressLine1").isString().notEmpty().withMessage("Address must be a string"),
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("City must be a string"),
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors, //add the errors if it is there 
];
// all the validations are wrritien here that everything shoudl be correct or not 
