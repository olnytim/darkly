import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function scrappingRecursive(url) {
    try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);

        const links = $('a');
        for (let i = 0; i < links.length; i++) {
            const finalLink = $(links[i]).attr('href');
            if (finalLink === 'README') {
                const readmeResponse = await fetch(url + finalLink);
                const readmeText = await readmeResponse.text();
                if (/flag/.test(readmeText)) {
                    console.log(readmeText);
                    process.exit(1);
                }
            } else if (finalLink !== '../') {
                await scrappingRecursive(url + finalLink);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function main(ipAddress) {
    if (!ipAddress) {
        console.error('Please provide only an IP address as a parameter.');
        process.exit(1);
    }
    const baseUrl = `http://${ipAddress}/.hidden/`;
    scrappingRecursive(baseUrl);
}

if (process.argv.length !== 3) {
    console.error('Please provide only an IP address as a parameter.');
    process.exit(1);
}
const ipAddress = process.argv[2];
main(ipAddress);
