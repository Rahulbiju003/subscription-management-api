import aj from "../config/arcjet.js";

const ajMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested : 1 });
        console.log("Arcjet Decision:", decision);

        if (decision.isDenied) {
            console.log("Arcjet Block Reason:", decision.reason);
            if (decision.reason.isRateLimit()) {
                return res.status(429).send("Rate limit exceeded");
            }
            if (decision.reason.isBot()) {
                return res.status(403).send("Bot detected");
            }
            if (decision.reason.isShield()) {
                return res.status(403).send("Shield blocked the request");
            }
            return res.status(403).send("Access denied");
        }
        next();
    } catch (error) {
        console.error(`ARCJET Middleware Error: ${error}`);
        next(error);
    }
};

export default ajMiddleware;