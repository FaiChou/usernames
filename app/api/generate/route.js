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
            content: "你是一个影视和文学作品专家。你需要从真实存在的英美文学作品、电影或电视剧中随机选择一部，提供准确的信息。不要创造或编造任何虚构的作品或角色。请直接返回JSON格式的数据，不要使用markdown格式或其他标记。"
          },
          {
            role: "user",
            content: "请随机选择一部真实存在的英美经典文学作品、电影或电视剧（包括但不限于：哈利波特系列、权力的游戏、傲慢与偏见、老友记、神探夏洛克等）。提供以下信息：1. 作品标题 2. 发布年份 3. 简短介绍 4. 该作品中10个主要角色的英文名字。请确保所有信息都是真实准确的，不要编造。直接返回JSON格式数据，包含字段：title（英文标题）, year（年份）, description（英文描述）, characters（角色名字数组）。不要添加markdown标记。"
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