export default function (callback) {
  const data = [
    // ========== 进度与思考序列 ==========
    // 1. 第一个进度容器（初始全部 pending）
    `:::progress
\`\`\`json
[
    {
        "content": "解析气象预报与实测数据，识别高风险山洪沟",
        "status": "pending"
    },
    {
        "content": "调用山洪风险评估模型，生成风险等级分布",
        "status": "pending"
    },
    {
        "content": "关联承灾体信息，评估潜在影响规模",
        "status": "pending"
    },
    {
        "content": "生成避险转移建议与责任人清单",
        "status": "pending"
    },
    {
        "content": "发布预警信息并同步推送至相关责任人",
        "status": "pending"
    }
]
\`\`\`
:::\n\n`,

    // 2. 第一个思考容器（开始思考）
    `:::thinking
🔧 调用 [气象预报] 工具  
获取未来12小时降水格点数据（分辨率1km×1km），识别强降雨中心。  
* 数据源：ECMWF 高分辨率模式  
* 时间分辨率：逐小时  
* 空间分辨率：1km×1km  
* 预计完成时间：2秒
:::\n\n`,

    // 3. 进度更新：第一项进行中
    `:::progress
\`\`\`json
[
    {
        "content": "解析气象预报与实测数据，识别高风险山洪沟",
        "status": "in_progress"
    },
    {
        "content": "调用山洪风险评估模型，生成风险等级分布",
        "status": "pending"
    },
    {
        "content": "关联承灾体信息，评估潜在影响规模",
        "status": "pending"
    },
    {
        "content": "生成避险转移建议与责任人清单",
        "status": "pending"
    },
    {
        "content": "发布预警信息并同步推送至相关责任人",
        "status": "pending"
    }
]
\`\`\`
:::\n\n`,

    // 4. 第二个思考容器
    `:::thinking
🔧 调用 [山洪预报] 工具  
基于水文模型（HEC-HMS）和土壤饱和度数据，推演山洪风险等级。  
* 模型版本：HEC-HMS 4.5  
* 输入数据：雷达反演降水、土壤湿度产品  
* 输出：风险等级（红/橙/黄）、峰值流量  
* 预计耗时：3秒
:::\n\n`,

    // 5. 进度更新：第一项完成，第二项进行中
    `:::progress
\`\`\`json
[
    {
        "content": "解析气象预报与实测数据，识别高风险山洪沟",
        "status": "completed"
    },
    {
        "content": "调用山洪风险评估模型，生成风险等级分布",
        "status": "in_progress"
    },
    {
        "content": "关联承灾体信息，评估潜在影响规模",
        "status": "pending"
    },
    {
        "content": "生成避险转移建议与责任人清单",
        "status": "pending"
    },
    {
        "content": "发布预警信息并同步推送至相关责任人",
        "status": "pending"
    }
]
\`\`\`
:::\n\n`,

    // 6. 第三个思考容器
    `:::thinking
🔧 调用 [避险转移建议] 工具  
结合危险区人口分布、安置点容量，生成转移优先级队列。  
* 人口数据来源：第七次人口普查 + 动态更新  
* 安置点容量：74个安置点，最大容纳5000人  
* 算法：基于风险等级、人口密度、撤离距离的多目标优化  
* 预计生成时间：2.5秒
:::\n\n`,

    // 7. 进度更新：前两项完成，第三项进行中
    `:::progress
\`\`\`json
[
    {
        "content": "解析气象预报与实测数据，识别高风险山洪沟",
        "status": "completed"
    },
    {
        "content": "调用山洪风险评估模型，生成风险等级分布",
        "status": "completed"
    },
    {
        "content": "关联承灾体信息，评估潜在影响规模",
        "status": "in_progress"
    },
    {
        "content": "生成避险转移建议与责任人清单",
        "status": "pending"
    },
    {
        "content": "发布预警信息并同步推送至相关责任人",
        "status": "pending"
    }
]
\`\`\`
:::\n\n`,

    // 8. 第四个思考容器
    `:::thinking
🔧 调用 [消息推送（邮件+预警发布）] 工具  
向9条山洪沟责任人发送红色预警指令，并同步至省级应急平台。  
* 推送方式：短信、邮件、应急广播  
* 覆盖范围：9条沟、23个行政村、2896人  
* 平台接口：省级应急指挥系统API  
* 预计完成：1秒
:::\n\n`,

    // tip / warning 自定义容器示例
    `:::tip
\`\`\`json
{
  "title": "提示（JSON 渲染）",
  "text": "tip/warning 也通过自定义插槽替换默认容器渲染，并从 node.token 树中提取 json fence。",
  "items": [
    "结构化数据建议一次性输出整块",
    "避免半截 JSON 导致解析失败",
    "也能减少不必要的重复渲染"
  ]
}
\`\`\`
:::\n\n`,

    `:::warning
\`\`\`json
{
  "title": "注意（JSON 渲染）",
  "text": "本页为演示数据：地名/机构名已脱敏处理，请勿用于真实指挥调度。",
  "items": [
    "地图/图表块建议整块输出",
    "正文可按字流式输出提升真实感"
  ]
}
\`\`\`
:::\n\n`,

    // 9. 进度最终完成（全部 completed）
    `:::progress
\`\`\`json
[
    {
        "content": "解析气象预报与实测数据，识别高风险山洪沟",
        "status": "completed"
    },
    {
        "content": "调用山洪风险评估模型，生成风险等级分布",
        "status": "completed"
    },
    {
        "content": "关联承灾体信息，评估潜在影响规模",
        "status": "completed"
    },
    {
        "content": "生成避险转移建议与责任人清单",
        "status": "completed"
    },
    {
        "content": "发布预警信息并同步推送至相关责任人",
        "status": "completed"
    }
]
\`\`\`
:::\n\n`,

    // ========== 思考结束，开始输出结果正文（更丰富的内容） ==========
    '# 🌧️ 山洪红色预警通报（2026-03-26 11:00）\n\n',
    '⚠️ **风险态势研判**  \n',
    '根据最新气象预报与山洪风险模型推演，',
    '未来12小时内，7条山洪沟已达红色预警级别，2条为橙色预警：\n\n',
    '- 🔴 **红色预警（7条）**：',
    '沟段A1、沟段A2、沟段A3、沟段A4、',
    '沟段A5、沟段A6、沟段A7\n',
    '- 🟠 **橙色预警（2条）**：沟段B1、沟段B2  \n\n',
    '最大过程雨量达 **130mm**，',
    '最大小时雨强 **23mm/h**，',
    '叠加前期土壤饱和，山洪发生概率极高。\n\n',
    '---\n\n',
    '## 🏘️ 影响评估（模型输出）\n\n',
    '- 受威胁人口：共涉及 **2896名** 险户，',
    '分布于9条山洪沟、23个行政村\n',
    '- **重点承灾体**：\n',
    '  - 景区：示例景区A（沟段A5、沟段A1）\n',
    '  - 露营地：示例营地A（沟段A5）、',
    '示例营地B（沟段A1）\n',
    '  - 养老机构：示例机构A（沟段A1）、',
    '示例机构B（沟段A2）\n\n',
    '## 🚨 响应协同建议\n\n',
    '1. 立即启动 **Ⅰ级应急响应**，',
    '落实“三个避让”和“三个紧急撤离”\n',
    '2. **优先转移**：示例村A（485人）、',
    '示例村B（321人）、示例村C（183人）、',
    '示例村D（129人）等高风险村\n',
    '3. **安置保障**：启用74个安置点，',
    '落实“一对一”包保责任制\n',
    '4. **动态监测**：加密雷达外推与视频监控频次，',
    '每30分钟更新一次雨情水情\n\n',
    `## 🗺️ 风险分布地图

:::map
**GIS 实时数据**
- 图层：山洪风险区划、人口分布、安置点、交通路网
- 更新频率：15分钟
- 交互功能：点击查看详情、路径规划
\`\`\`json
{
  "center": [116.397, 39.907],
  "zoom": 8,
  "polygons": [
    {
      "id": "risk-area-1",
      "name": "高风险区A",
      "style": { "stroke": "#ff4d4f", "strokeWidth": 2, "fill": "#ff4d4f", "fillOpacity": 0.25 },
      "paths": [
        [116.10, 40.10],
        [116.35, 40.18],
        [116.52, 39.98],
        [116.28, 39.86],
        [116.10, 40.10]
      ]
    },
    {
      "id": "risk-area-2",
      "name": "高风险区B",
      "style": { "stroke": "#fa8c16", "strokeWidth": 2, "fill": "#fa8c16", "fillOpacity": 0.22 },
      "paths": [
        [116.55, 39.80],
        [116.80, 39.92],
        [116.72, 39.68],
        [116.50, 39.62],
        [116.55, 39.80]
      ]
    }
  ]
}
\`\`\`
![地图预览](https://example.com/map-preview.png)
:::

`,
    `## 📊 风险趋势预测

:::chart
**未来6小时风险指数变化**
\`\`\`json
{
  "xAxis": ["11:00","12:00","13:00","14:00","15:00","16:00"],
  "series": [
    { "name": "风险指数", "type": "line", "data": [92, 88, 85, 79, 72, 65] },
    { "name": "预警触发次数", "type": "bar", "data": [6, 5, 5, 4, 3, 2] }
  ]
}
\`\`\`
![趋势图](https://example.com/trend-chart.png)
:::

`,
    `## 🗺️ 风险分布地图

:::map
**GIS 实时数据**
- 图层：山洪风险区划、人口分布、安置点、交通路网
- 更新频率：15分钟
- 交互功能：点击查看详情、路径规划
\`\`\`json
{
  "center": [121.4737, 31.2304],
  "zoom": 9,
  "polygons": [
    {
      "id": "risk-area-1",
      "name": "高风险区A",
      "style": { "stroke": "#ff4d4f", "strokeWidth": 2, "fill": "#ff4d4f", "fillOpacity": 0.25 },
      "paths": [
        [121.30, 31.33],
        [121.48, 31.37],
        [121.60, 31.25],
        [121.38, 31.18],
        [121.30, 31.33]
      ]
    },
    {
      "id": "risk-area-2",
      "name": "高风险区B",
      "style": { "stroke": "#fa8c16", "strokeWidth": 2, "fill": "#fa8c16", "fillOpacity": 0.22 },
      "paths": [
        [121.55, 31.17],
        [121.70, 31.22],
        [121.66, 31.10],
        [121.52, 31.06],
        [121.55, 31.17]
      ]
    }
  ]
}
\`\`\`
![地图预览](https://example.com/map-preview.png)
:::

`,
    `## 📊 风险趋势预测

:::chart
**未来6小时风险指数变化**
\`\`\`json
{
  "xAxis": ["11:30","12:30","13:30","14:30","15:30","16:30"],
  "series": [
    { "name": "风险指数", "type": "line", "data": [88, 84, 80, 76, 70, 60] },
    { "name": "预警触发次数", "type": "bar", "data": [5, 5, 4, 4, 3, 2] }
  ]
}
\`\`\`
![趋势图](https://example.com/trend-chart.png)
:::

`,
    '## ✅ 执行情况（截至11:30）\n\n',
    '| 行政村 | 计划转移人数 | 已转移人数 | 完成率 | 安置点 |\n',
    '|-------|------------|----------|-------|-------|\n',
    '| 示例村A | 485 | 485 | 100% | 示例学校A |\n',
    '| 示例村B | 321 | 321 | 100% | 示例安置点B |\n',
    '| 示例村C | 183 | 156 | 85% | 示例文化站C |\n',
    '| 示例村D | 129 | 98 | 76% | 示例学校D |\n\n',
    '> **备注**：剩余人员正在有序转移，',
    '预计12:00前全部完成。\n\n',
    '### 响应物资清单\n\n',
    '- 应急照明设备：150套\n',
    '- 救生衣：2000件\n',
    '- 编织袋：50000条\n',
    '- 卫星电话：15部\n',
    '- 冲锋舟：8艘\n',
    '- 发电机：20台\n\n',
    '### 参考资料\n\n',
    '```sql\n',
    '-- 险户信息查询示例\n',
    'SELECT \n',
    '    village, \n',
    '    COUNT(*) AS household_count, \n',
    '    SUM(population) AS total_population\n',
    'FROM risk_households\n',
    "WHERE risk_level = 'red'\n",
    'GROUP BY village;\n',
    '```\n\n',
    '### 后续工作建议\n',
    '1. **持续监测**：加密气象雷达和雨量站数据更新频率至10分钟\n',
    '2. **演练评估**：组织一次全流程应急演练，检验响应时效\n',
    '3. **宣传培训**：对险户开展防灾知识宣传，提高自救能力\n\n',
    '**请各级责任人即刻行动，确保人民生命安全！**\n',
    '---\n',
    '> 本报告由山洪风险智能分析系统自动生成，如有疑问请联系应急指挥中心。\n',
  ];

  // 逐字输出：更像真实“打字机”，这里故意放慢
  const SPEED_CHAR_MS = 30;
  // 普通块之间的间隔
  const SPEED_CHUNK_MS = 650;
  // 地图/图表块输出后：模拟“生成图表/地图需要时间”
  const SPEED_RENDER_BLOCK_MS = 1800;

  let index = 0;
  let typingText = '';
  let typingPos = 0;

  const isStructuredBlockLine = (s) =>
    typeof s === 'string' &&
    (s.startsWith(':::') || s.startsWith('```') || s.startsWith('![') || s.startsWith('{') || s.startsWith('  "'));

  const shouldTypewrite = (s) =>
    typeof s === 'string' && s.length > 18 && !isStructuredBlockLine(s) && !s.includes('```') && !s.includes(':::');

  const schedule = (fn, ms) => {
    setTimeout(fn, ms);
  };

  const getChunkDelay = (chunk) => {
    if (typeof chunk !== 'string') return SPEED_CHUNK_MS;
    if (chunk.includes(':::map') || chunk.includes(':::chart')) return SPEED_RENDER_BLOCK_MS;
    return SPEED_CHUNK_MS;
  };

  const step = () => {
    // typing mode
    if (typingText) {
      if (typingPos < typingText.length) {
        callback(typingText[typingPos]);
        typingPos++;
        schedule(step, SPEED_CHAR_MS);
        return;
      }
      typingText = '';
      typingPos = 0;
      schedule(step, SPEED_CHUNK_MS);
      return;
    }

    // chunk mode
    if (index >= data.length) {
      callback('\n\n✅ mock 输出完成。\n');
      return;
    }

    const chunk = data[index];
    index++;

    if (shouldTypewrite(chunk)) {
      typingText = chunk;
      typingPos = 0;
      schedule(step, SPEED_CHAR_MS);
      return;
    }

    callback(chunk);
    schedule(step, getChunkDelay(chunk));
  };

  step();
}
