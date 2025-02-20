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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
exports.router = router;
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_API_KEY, {
    apiVersion: "2022-11-15",
});
const PAYMENT_CONFIRMARION_URL = `${process.env.FRONT_END_URL}/payment-confirmation`;
router.post("/create-checkout-session", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const items = request.body.products.map((product) => ({
        price_data: {
            currency: "brl",
            product_data: {
                name: product.name,
            },
            unit_amount: parseInt(`${product.price}00`),
        },
        quantity: product.quantity,
    }));
    const session = yield stripe.checkout.sessions.create({
        line_items: items,
        mode: "payment",
        success_url: `${PAYMENT_CONFIRMARION_URL}?success=true`,
        cancel_url: `${PAYMENT_CONFIRMARION_URL}?success=false`,
    });
    response.json({ url: session.url });
}));
