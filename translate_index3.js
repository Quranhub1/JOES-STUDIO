const fs = require('fs');

const filePath = '/workspace/ae1205ff-315f-4a05-83d0-9b42ab893b13/sessions/agent_60af3c1d-144a-46ef-9dfc-3153ad0b5c2f/PaperStudio-main/index.html';

let content = fs.readFileSync(filePath, 'utf8');

function replaceAll(str, replacements) {
  let found = 0;
  for (const [oldStr, newStr] of replacements) {
    const idx = str.indexOf(oldStr);
    if (idx >= 0) {
      str = str.split(oldStr).join(newStr);
      found++;
    } else {
      console.log(`NOT FOUND: ${oldStr.substring(0, 60)}`);
    }
  }
  console.log(`Successfully replaced ${found} strings`);
  return str;
}

const replacements = [
  // HTML visible text (tag content)
  ['>授予权限<', '>Grant Permission<'],
  ['>表格编辑器<', '>Table Editor<'],
  ['>取消<', '>Cancel<'],
  ['>完成并插入<', '>Done & Insert<'],
  ['>序列号<', '>Serial Number<'],
  ['>纸张选项<', '>Paper Options<'],
  ['>标签选项<', '>Label Options<'],
  ['>属性<', '>Properties<'],
  ['>图层<', '>Layers<'],
  ['>数据源<', '>Data Source<'],
  ['>静态<', '>Static<'],
  ['>变量<', '>Variable<'],
  ['>序列<', '>Serial<'],
  ['>条码设置<', '>Barcode Settings<'],
  ['>常用二维码<', '>Common QR Codes<'],
  ['>常用条形码<', '>Common Barcodes<'],
  ['>物流与供应链<', '>Logistics & Supply Chain<'],
  ['>工业/医疗/其他<', '>Industrial/Medical/Other<'],
  ['>邮政码<', '>Postal Codes<'],
  ['>内容数据<', '>Content Data<'],
  ['>使用共享字段<', '>Use Shared Field<'],
  ['>条码颜色<', '>Barcode Color<'],
  ['>显示文字<', '>Show Text<'],
  ['>文字位置<', '>Text Position<'],
  ['>条码高度比例<', '>Barcode Height Ratio<'],
  ['>文字大小<', '>Font Size<'],
  ['>文字间距<', '>Text Spacing<'],
  ['>纠错等<', '>Error Correction<'],
  ['>字体<', '>Font Family<'],
  ['>行高<', '>Line Height<'],
  ['>字间距<', '>Letter Spacing<'],
  ['>日期时间设置<', '>Date/Time Settings<'],
  ['>显示日期<', '>Show Date<'],
  ['>显示时间<', '>Show Time<'],
  ['>日期格式<', '>Date Format<'],
  ['>时间格式<', '>Time Format<'],
  ['>天数偏移<', '>Day Offset<'],
  ['>分钟偏移<', '>Minute Offset<'],
  ['>页码设置<', '>Page Number Settings<'],
  ['>页码格式<', '>Page Format<'],
  ['>起始页码<', '>Start Page<'],
  ['>序列号设置<', '>Serial Number Settings<'],
  ['>起始值<', '>Start Value<'],
  ['>间隔值<', '>Step Value<'],
  ['>重复次数<', '>Repeat Count<'],
  ['>变化类型<', '>Change Type<'],
  ['>递增<', '>Increment<'],
  ['>递减<', '>Decrement<'],
  ['>生成数量<', '>Generate Count<'],
  ['>预览: <', '>Preview: <'],
  ['>线颜色<', '>Line Color<'],
  ['>线宽<', '>Line Width<'],
  ['>虚线<', '>Dashed<'],
  ['>填充<', '>Fill<'],
  ['>边框颜色<', '>Border Color<'],
  ['>虚线描边<', '>Dashed Stroke<'],
  ['>角类型<', '>Corner Type<'],
  ['>角尺寸<', '>Corner Size<'],
  ['>左上<', '>Top-Left<'],
  ['>右上<', '>Top-Right<'],
  ['>左下<', '>Bottom-Left<'],
  ['>右下<', '>Bottom-Right<'],
  ['>编辑表格<', '>Edit Table<'],
  ['>替换图片<', '>Replace Image<'],
  ['>设为背景<', '>Set as Background<'],
  ['>铺满页面<', '>Fill Page<'],
  ['>删除背景图片<', '>Delete Background Image<'],
  ['>导入 Excel 数据<', '>Import Excel Data<'],
  ['>支持 .xlsx / .xls 格式<', '>Supports .xlsx / .xls formats<'],
  ['>选择本地文件<', '>Select Local File<'],
  ['>字段列表<', '>Field List<'],
  ['>暂无字段<', '>No fields available<'],
  ['>重新读取文件<', '>Reload File<'],
  ['>无<', '>None<'],
  ['>共享<', '>Share<'],
  ['>引用<', '>Reference<'],
  ['>选择共享字段<', '>Select Shared Field<'],
  ['>选择已存在共享字段，内容将自动同步。<', '>Select an existing shared field, content will auto-sync.<'],

  // Title attributes
  ['title="引用其他对象的共享数据"', 'title="Reference shared data from other objects"'],
  ['title="无填充(透明)"', 'title="No fill (transparent)"'],
  ['title="竖排文字"', 'title="Vertical Text"'],
  ['title="文件名"', 'title="File Name"'],
  ['title="断开连接"', 'title="Disconnect"'],
  ['title="重新绑定"', 'title="Rebind"'],
  ['title="删除"', 'title="Delete"'],
  ['title="字号"', 'title="Font Size"'],
  ['title="边框宽度"', 'title="Border Width"'],
  ['title="边框颜色"', 'title="Border Color"'],
  ['title="背景颜色"', 'title="Background Color"'],
  ['title="文字颜色"', 'title="Text Color"'],
  ['title="合并"', 'title="Merge"'],
  ['title="拆分"', 'title="Split"'],
  ['title="删除选中行"', 'title="Delete Row"'],
  ['title="删除选中列"', 'title="Delete Column"'],
  ['title="编辑器视图缩放"', 'title="Editor View Zoom"'],

  // Option text inside select elements
  ['>左对齐<', '>Align Left<'],
  ['>右对齐<', '>Align Right<'],
  ['>第 1 页<', '>Page 1<'],

  // Font names in option elements
  ['>思源宋体<', '>Source Han Serif CN<'],
  ['>宋体<', '>SimSun<'],
  ['>楷体<', '>KaiTi<'],
  ['>黑体<', '>SimHei<'],

  // SVG error text
  ['>加载失败<', '>Load Failed<'],

  // Layer panel labels
  ['"条码"', '"Barcode"'],
  ['"表格"', '"Table"'],
  ['"文本"', '"Text"'],
  ['"图片"', '"Image"'],
  ['"线条"', '"Line"'],
  ['"形状"', '"Shape"'],
  ['"组合"', '"Group"'],
  ['"【背景】图片"', '"[Background] Image"'],

  // Paper defaults (JS code)
  ['label: "空白纸"', 'label: "Blank Paper"'],
  ['label: "横线纸"', 'label: "Ruled Paper"'],
  ['label: "方格纸"', 'label: "Grid Paper"'],
  ['label: "作文纸"', 'label: "Composition Paper"'],
  ['label: "英文纸"', 'label: "English Paper"'],
  ['label: "乐谱纸"', 'label: "Music Paper"'],
  ['label: "田字格"', 'label: "Tianzige"'],
  ['label: "米字格"', 'label: "Mizige"'],
  ['label: "回字格"', 'label: "Huizige"'],
  ['label: "宫格纸"', 'label: "Jiugongge"'],
  ['label: "点阵纸"', 'label: "Dot Paper"'],
  ['label: "等距网格"', 'label: "Isometric Grid"'],
  ['label: "六边形网格"', 'label: "Hexagon Grid"'],
  ['label: "标签打印"', 'label: "Label Print"'],

  // Select option value
  ['>不绑定数据<', '>Unbound Data<'],

  // JS font map
  ['"simsun", "宋体"', '"simsun", "SimSun"'],
  ['"simhei", "黑体"', '"simhei", "SimHei"'],
  ['"kaiti", "楷体", "kaiti_gb2312"', '"kaiti", "KaiTi", "kaiti_gb2312"'],
  ['"fangsong", "仿宋"', '"fangsong", "FangSong"'],

  // Toast and UI messages
  ['"已取消加载数据源"', '"Data source loading cancelled"'],
  ['"请先选中一个图片对象"', '"Please select an image object first"'],
  ['"背景图片已移除"', '"Background image removed"'],
  ['"请先选中图片"', '"Please select an image first"'],
  ['"背景已更新"', '"Background updated"'],
  ['"图片已替换"', '"Image replaced"'],
  ['"已设为背景"', '"Set as background"'],
  ['"请先选中一张图片"', '"Please select an image first"'],
  ['"所选对象全部已锁定，无法删除"', '"All selected objects are locked, cannot delete"'],
  ['"对象已锁定，无法删除"', '"Object is locked, cannot delete"'],
  ['"创建条码失败: "', '"Failed to create barcode: "'],
  ['"对象已锁定"', '"Object locked"'],
  ['"对象已解锁"', '"Object unlocked"'],
  ['"请先选择单元格"', '"Please select cells first"'],
  ['"至少保留一行"', '"At least one row must be kept"'],
  ['"至少保留一列"', '"At least one column must be kept"'],
  ['"请选择至少两个单元格"', '"Please select at least two cells"'],
  ['"请选择矩形区域"', '"Please select a rectangular area"'],
  ['"区域含已合并单元格"', '"Area contains merged cells"'],
  ['"表格已更新"', '"Table updated"'],
  ['"表格已插入"', '"Table inserted"'],
  ['"日期和时间至少显示一项"', '"At least one of date and time must be displayed"'],
  ['"请按住 Shift 依次点击选择对象进行对齐"', '"Hold Shift and click objects sequentially to align"'],
  ['"至少需要3个元素"', '"At least 3 elements are required"'],
  ['"文件格式错误"', '"Invalid file format"'],
  ['"已粘贴为引用对象"', '"Pasted as reference object"'],
  ['"关联源不存在，已转为静态文本"', '"Association source does not exist, converted to static text"'],
  ['"已取消同步"', '"Sync cancelled"'],
  ['"请先加载数据源"', '"Please load data source first"'],
  ['"目标工作表为空或无字段"', '"Target worksheet is empty or has no fields"'],
  ['"请先在"数据源"面板加载 Excel 文件"', '"Please load an Excel file in the "Data Source" panel first"'],
  ['"无法找到关联文件: "', '"Cannot find associated file: "'],
  ['"已绑定文件夹: "', '"Folder bound: "'],
  ['"文件已失效: "', '"File expired: "'],
  ['"打开文件失败"', '"Failed to open file"'],
  ['"文件读取失败"', '"File read failed"'],
  ['"无法访问文件夹"', '"Cannot access folder"'],
  ['"读取文件夹句柄失败"', '"Failed to read folder handle"'],
  ['"检查重复文件夹句柄失败，将创建新 ID"', '"Duplicate folder handle check failed, will create new ID"'],
  ['"无法加载默认字体"', '"Failed to load default font"'],
  ['"检查重复句柄失败，将创建新 ID"', '"Duplicate handle check failed, will create new ID"'],
  ['"TTC 解析失败"', '"TTC parsing failed"'],
  ['"Render Error:"', '"Render Error:"'],
  ['"Label generation: Barcode error"', '"Label generation: Barcode error"'],
  ['"VDP Barcode Update Failed:"', '"VDP Barcode Update Failed:"'],
  ['"Restore ImgDir Failed"', '"Restore ImgDir Failed"'],
  ['"Load img failed"', '"Load img failed"'],
  ['"Font Access Error"', '"Font Access Error"'],
  ['"未找到可匹配字段或无需更新"', '"No matching fields found or no update needed"'],
  ['"已更新"', '"Updated"'],
  ['" 个字段"', '" fields"'],
  ['" 条数据"', '" records"'],
  ['"Sheet switch error:"', '"Sheet switch error:"'],
  ['"无字段"', '"No fields"'],
  ['"已删除 ', '"Deleted '],
  ['" 个对象，', '" objects, '],
  ['" 个锁定对象被保留"', '" locked objects preserved"'],
  ['"处理中..."', '"Processing..."'],
  ['"正在渲染PDF.."', '"Rendering PDF..."'],
  ['`正在生成第 ${i + 1} 页...`', '`Generating page ${i + 1}...`'],
  ['"正在保存 PDF..."', '"Saving PDF..."'],
  ['`PDF 导出成功 (${loopCount} 页`)', '`PDF exported successfully (${loopCount} pages)`'],
  ['"设计稿"', '"Design"'],
  ['"项目已保存"', '"Project saved"'],
  ['"项目加载成功"', '"Project loaded successfully"'],
  ['"数据解析异常: "', '"Data parsing error: "'],
  ['"已粘贴为引用对象"', '"Pasted as reference object"'],
  ['"关联源不存在，已转为静态文本"', '"Association source does not exist, converted to static text"'],
  ['"已取消同步"', '"Sync cancelled"'],
  ['"模板加载失败"', '"Failed to load template"'],
  ['"下载模板..."', '"Downloading template..."'],
  ['"加载失败"', '"Loading failed"'],
  ['"加载中..."', '"Loading..."'],
  ['"创建中..."', '"Creating..."'],
  ['"打开中..."', '"Opening..."'],
  ['"首次导出需加载系统字体..."', '"First export needs to load system fonts..."'],
  ['"字体应用到 PDF 失败:"', '"Failed to apply fonts to PDF:"'],
  ['"导出失败: "', '"Export failed: "'],
  ['"打印生成失败: "', '"Print generation failed: "'],
  ['"数据源已更新！"', '"Data source updated!"'],

  // Date format labels
  ['"2024年01月30日"', '"2024-01-30"'],
  ['"2024年01月"', '"2024-01"'],
  ['"01月30日"', '"01-30"'],
  ['"2024年"', '"2024"'],
  ['"30/01/2024 (日月年)"', '"30/01/2024 (DD/MM/YYYY)"'],
  ['"01/30/2024 (月日年)"', '"01/30/2024 (MM/DD/YYYY)"'],
  ['"30-01-2024"', '"30-01-2024"'],
  ['"2024 (仅年)"', '"2024 (Year only)"'],
  ['"01 (仅月)"', '"01 (Month only)"'],
  ['"01月"', '"01 Month"'],
  ['"30 (仅日)"', '"30 (Day only)"'],
  ['"30日"', '"30 Day"'],

  // Time format labels
  ['"14时30分59秒"', '"14:30:59"'],
  ['"14时30分"', '"14:30"'],
  ['"30分59秒"', '"30min 59s"'],
  ['"14点30分"', '"14:30"'],
  ['"14 (仅时-24)"', '"14 (Hour-24)"'],
  ['"14时"', '"14h"'],
  ['"2 (仅时-12)"', '"2 (Hour-12)"'],
  ['"30 (仅分)"', '"30 (Min only)"'],
  ['"30分"', '"30min"'],
  ['"59 (仅秒)"', '"59 (Sec only)"'],
  ['"59秒"', '"59sec"'],

  // Page format options
  ['"第 1 页"', '"Page 1"'],
  ['"- 1 -"', '"- 1 -"'],
  ['"第 {page} 页"', '"Page {page}"'],

  // Local fonts label
  ['"--- 本地系统字体 ---"', '"--- Local System Fonts ---"'],

  // Prompt text
  ['"提示：切换到"属性设置"选中文字，开启"可变数据"以绑定字段。"', '"Tip: Switch to "Properties" panel, select text, enable "Variable Data" to bind fields."'],
  ['"提示：请使用表格工具调整行列、合并拆分以及单元格样式。"', '"Tip: Use table tools to adjust rows/columns, merge/split, and cell styles."'],
  ['"关闭后，背景图仅在设计时可见，不会被打印或导出为PDF。"', '"When disabled, background image is only visible during design and won\'t be printed or exported as PDF."'],
  ['placeholder="输入共享名 (如: price)"', 'placeholder="Enter shared name (e.g., price)"'],
];

replacements.sort((a, b) => b[0].length - a[0].length);

console.log('Starting third pass translations...');
const originalLength = content.length;
content = replaceAll(content, replacements);
console.log(`File size changed from ${originalLength} to ${content.length} bytes`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! Third pass complete.');
