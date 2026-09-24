from pathlib import Path
import hashlib, json, re, time, urllib.request
from playwright.sync_api import sync_playwright
URL='https://karimovdo2.github.io/test/profderma/'
SHA='4243d3d72d756d41923c4906601b21dedb07b8219da6563d66ed6859e0ef0cc7'
OUT=Path('test-output');OUT.mkdir(exist_ok=True)
for attempt in range(30):
    try:
        req=urllib.request.Request(URL+'?check='+str(int(time.time())),headers={'Cache-Control':'no-cache'})
        with urllib.request.urlopen(req,timeout=20) as response:
            data=response.read();status=response.status;ctype=response.headers.get('Content-Type')
        if status==200 and hashlib.sha256(data).hexdigest()==SHA:
            print(json.dumps({'url':URL,'status':status,'content_type':ctype,'bytes':len(data),'sha256':SHA,'verified':True}),flush=True)
            break
    except Exception as err:
        print('Waiting for publication:',type(err).__name__,flush=True)
    time.sleep(8)
else:
    raise SystemExit('Published HTML verification failed')
results=[]
forbidden=re.compile(r'демо[а-яё-]*|Минимальн[^.\n]{0,100}(?:стаж|порог)',re.I)
with sync_playwright() as p:
    for engine,device in [('chromium','Pixel 7'),('webkit','iPhone 13')]:
        browser=getattr(p,engine).launch()
        context=browser.new_context(**p.devices[device])
        page=context.new_page();errors=[];requests=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('request',lambda req:requests.append({'url':req.url,'method':req.method}))
        page.on('dialog',lambda dialog:dialog.accept())
        response=page.goto(URL,wait_until='networkidle',timeout=60000)
        assert response.status==200
        page.locator('.registry-table tbody tr').nth(5).wait_for()
        assert not forbidden.search(page.locator('body').inner_text())
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        page.screenshot(path=str(OUT/(engine+'-registry.png')),full_page=True)
        page.locator('#case-search').fill('Парикмахер')
        assert page.locator('.registry-table tbody tr').count()==1
        page.locator('#case-search').fill('')
        page.locator('button[data-action="new"]').first.click()
        page.locator('#field-caseCode').fill('WEB-TEST-'+engine)
        page.locator('#field-profession').fill('Вымышленный пример')
        for field,value in [('genotype','GT'),('dermatitis','confirmed'),('exposure','yes'),('continueWork','yes'),('tenure','yes')]:
            page.locator('#field-'+field).select_option(value)
        page.locator('#field-tenureYears').fill('8,5')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        page.screenshot(path=str(OUT/(engine+'-form.png')),full_page=True)
        page.locator('#save-case').click()
        page.locator('.report-content').wait_for()
        assert 'Динамическое наблюдение' in page.locator('.report-content').inner_text()
        assert not forbidden.search(page.locator('body').inner_text())
        page.screenshot(path=str(OUT/(engine+'-report.png')),full_page=True)
        page.locator('button[data-nav="cases"]').first.click()
        assert page.locator('.registry-table tbody tr').count()==7
        page.reload(wait_until='networkidle')
        page.locator('.registry-table tbody tr').nth(5).wait_for()
        assert page.locator('.registry-table tbody tr').count()==6
        assert not errors,errors
        assert not any(r['method']!='GET' or '/api/' in r['url'] for r in requests),requests
        result={'engine':engine,'browser_version':browser.version,'device_profile':device,'physical_device':False,'url':URL,'registry':True,'search':True,'form':True,'route':True,'responsive_layout':True,'in_memory_reset':True,'no_clinical_network_requests':True,'js_errors':errors}
        results.append(result);print(json.dumps(result,ensure_ascii=False),flush=True)
        context.close();browser.close()
(OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
