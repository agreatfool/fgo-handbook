import Crawler from "./Crawler";
import EmbeddedCodeConvertor from "./EmbeddedCodeConvertor";
import MasterDumper from "./MasterDumper";
import ResourceDownloader from "./ResourceDownloader";
import ResourceListBuilder from "./ResourceListBuilder";

async function run() {
    // 下载站点数据文件，并进行基本解析
    let crawler = new Crawler();
    await crawler.run();

    // 解析嵌入代码及数据
    let convertor = new EmbeddedCodeConvertor();
    await convertor.run();

    // 将 Master 数据分解成子文件
    let dumper = new MasterDumper();
    await dumper.run();

    // 下载 Icon 等资源
    let downloader = new ResourceDownloader();
    await downloader.run();

    // 构建 resources.json 列表文件
    let builder = new ResourceListBuilder();
    await builder.run();

    return Promise.resolve("Done");
}

run().then((_) => console.log(_));

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

