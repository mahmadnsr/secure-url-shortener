import { url_model } from "../models/urlModel.js";
import { nanoid } from "nanoid";

export async function redirect_url(req, res) {
    try {
        const shortID = req.params.shortURL;
        const entry = await url_model.findOneAndUpdate(
            { shortURL: shortID },
            { $push: { visit_history: { timestamp: new Date() } } },
            { returnDocument: "after", runValidators: true }
        );
        if (!entry) return res.status(404).send("URL not found");
        return res.redirect(entry.redirected_url);
    } catch (error) {
        console.error("Error in redirect:", error);
        return res.status(500).send("Internal Server Error");
    }
}

export const url_shortener = async (req, res) => {
    try {
        const body = req.body;
        if (!body.redirected_url) return res.status(400).json({ msg: "Bad Request: URL is required" });

        let finalUrl = body.redirected_url;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }
        try { new URL(finalUrl); } catch (err) { return res.status(400).json({ msg: "Invalid URL format" }); }

        const existingURL = await url_model.findOne({ redirected_url: finalUrl, createdBy: req.user._id });
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (existingURL) {
            const allUrls = await url_model.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
            return res.render("home", { urls: allUrls, shortURL: existingURL.shortURL, user: req.user, baseUrl: baseUrl });
        }

        const shortID = nanoid(8);
        await url_model.create({ shortURL: shortID, redirected_url: finalUrl, createdBy: req.user._id, visit_history: [] });
        
        const allUrls = await url_model.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        return res.render("home", { urls: allUrls, shortURL: shortID, user: req.user, baseUrl: baseUrl });

    } catch (error) {
        console.error("Error in shortening URL:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// UPDATED: Ab ye JSON ki jagah UI render karega
export const getAnalytics = async (req, res) => {
    try {
        const shortURL = req.params.shortURL;
        const result = await url_model.findOne({ shortURL });

        if (!result) {
            return res.status(404).send("URL not found");
        }

        return res.render("analytics", {
            shortURL: result.shortURL,
            redirected_url: result.redirected_url,
            totalClicks: result.visit_history.length,
            visitHistory: result.visit_history
        });
    } catch (error) {
        console.error("Error in analytics:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
