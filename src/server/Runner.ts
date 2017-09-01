import Crawler from "./Crawler";
import EmbeddedCodeConvertor from "./EmbeddedCodeConvertor";
import MasterDumper from "./MasterDumper";
import ResourceDownloader from "./ResourceDownloader";
import ResourceListBuilder from "./ResourceListBuilder";
import VersionCheck from "./VersionCheck";

async function run() {
    // 初始化版本文件等准备工作
    let verCheck = new VersionCheck();
    let newVer: string = await verCheck.run();

    // 下载站点数据文件，并进行基本解析
    let crawler = new Crawler(newVer);
    let needUpgrade = await crawler.run();

    // 检查是否有更新，无更新则回滚之前的文件操作
    if (!needUpgrade) {
        await verCheck.rollback();
        return Promise.resolve("[Runner] No upgrade, exit ...");
    }

    // 解析嵌入代码及数据
    let convertor = new EmbeddedCodeConvertor(newVer);
    await convertor.run();

    // 将 Master 数据分解成子文件
    let dumper = new MasterDumper(newVer);
    await dumper.run();

    // 下载网络图片等资源
    let downloader = new ResourceDownloader(newVer);
    await downloader.run();

    // 构建 resource 文件夹下资源
    let builder = new ResourceListBuilder(newVer);
    await builder.run();

    // 更新版本文件里的版本号
    await verCheck.upgradeVer();

    return Promise.resolve("Done");
}

run().then((_) => console.log(_));

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

