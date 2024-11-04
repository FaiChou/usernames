export async function POST(request) {
  try {
    const { apiUrl, apiKey } = await request.json();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "你是一个影视专家。你需要从豆瓣评分 Top 250 的欧美电影和美剧中随机选择一部，提供准确的信息。每次选择时要增加随机性，避免重复选择相同的作品。不要选择文学作品，只选择电影和电视剧。请直接返回JSON格式的数据。"
          },
          {
            role: "user",
            content: "请从豆瓣评分 Top 250 的欧美电影和美剧中随机选择一部（例如：肖申克的救赎、教父、绝命毒师、黑镜、真探等）。要充分随机，不要总是选择最热门的几部。提供以下信息：1. 作品英文标题 2. 首播/上映年份 3. 简短的英文介绍 4. 该作品中10个主要角色的英文名字。请确保所有信息都是真实准确的。直接返回JSON格式数据，包含字段：title（英文标题）, year（年份）, description（英文描述）, characters（角色名字数组）。"
          }
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    try {
      // 清理可能的 markdown 标记
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      const parsedContent = JSON.parse(cleanContent);
      return Response.json(JSON.stringify(parsedContent));
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.log('Raw content:', content);
      return Response.json({ error: 'Invalid JSON format' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 