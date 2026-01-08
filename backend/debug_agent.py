import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        print("Launching browser...")
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        page = await browser.new_page()
        print("Navigating to example.com...")
        try:
            await page.goto("http://example.com")
            print(f"Title: {await page.title()}")
        except Exception as e:
            print(f"Error accessing example.com: {e}")

        print("Navigating to DDG Lite...")
        try:
            await page.goto("https://lite.duckduckgo.com/lite/?q=test")
            print(f"Lite Title: {await page.title()}")
            content = await page.content()
            if "result-link" in content:
                print("Found result-link (DDG Lite OK)")
            else:
                 print("result-link NOT found in Lite")

        except Exception as e:
            print(f"Error accessing DDG Lite: {e}")

        print("Navigating to Yahoo JP...")
        try:
            await page.goto("https://search.yahoo.co.jp/search?p=test")
            print(f"Yahoo Title: {await page.title()}")
            content = await page.content()
            if "sw-Card__title" in content: # Common yahoo class
                print("Found sw-Card__title (Yahoo OK)")
            elif "sw-Card" in content:
                 print("Found sw-Card")
            else:
                print("Yahoo content snippet:")
                print(content[:500])
        except Exception as e:
            print(f"Error accessing Yahoo: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
