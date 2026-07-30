import type { CityOption } from "@/lib/types";

export const CITIES: CityOption[] = [
  city("beijing", "北京", "Beijing", "中国", "Asia/Shanghai", ["北京市", "beijing", "peking", "北京"]),
  city("shanghai", "上海", "Shanghai", "中国", "Asia/Shanghai", ["上海市", "shanghai", "上海"]),
  city("jinan", "济南", "Jinan", "中国", "Asia/Shanghai", ["濟南", "济南市", "jinan"]),
  city("guangzhou", "广州", "Guangzhou", "中国", "Asia/Shanghai", ["廣州", "guangzhou", "canton"]),
  city("shenzhen", "深圳", "Shenzhen", "中国", "Asia/Shanghai", ["shenzhen"]),
  city("chengdu", "成都", "Chengdu", "中国", "Asia/Shanghai", ["chengdu"]),
  city("chongqing", "重庆", "Chongqing", "中国", "Asia/Shanghai", ["重慶", "chongqing"]),
  city("wuhan", "武汉", "Wuhan", "中国", "Asia/Shanghai", ["武漢", "wuhan"]),
  city("hangzhou", "杭州", "Hangzhou", "中国", "Asia/Shanghai", ["hangzhou"]),
  city("nanjing", "南京", "Nanjing", "中国", "Asia/Shanghai", ["nanking", "nanjing"]),
  city("xian", "西安", "Xi'an", "中国", "Asia/Shanghai", ["西安市", "xian", "xi'an"]),
  city("zhengzhou", "郑州", "Zhengzhou", "中国", "Asia/Shanghai", ["鄭州", "zhengzhou"]),
  city("dalian", "大连", "Dalian", "中国", "Asia/Shanghai", ["大連", "dalian"]),
  city("qingdao", "青岛", "Qingdao", "中国", "Asia/Shanghai", ["青島", "tsingtao", "qingdao"]),
  city("tianjin", "天津", "Tianjin", "中国", "Asia/Shanghai", ["tientsin", "tianjin"]),
  city("shenyang", "沈阳", "Shenyang", "中国", "Asia/Shanghai", ["瀋陽", "shenyang"]),
  city("harbin", "哈尔滨", "Harbin", "中国", "Asia/Shanghai", ["哈爾濱", "harbin"]),
  city("changsha", "长沙", "Changsha", "中国", "Asia/Shanghai", ["長沙", "changsha"]),
  city("fuzhou", "福州", "Fuzhou", "中国", "Asia/Shanghai", ["foo chow", "fuzhou"]),
  city("xiamen", "厦门", "Xiamen", "中国", "Asia/Shanghai", ["廈門", "amoy", "xiamen"]),
  city("hong-kong", "香港", "Hong Kong", "中国香港", "Asia/Hong_Kong", ["hong kong", "hongkong"]),
  city("taipei", "台北", "Taipei", "中国台湾", "Asia/Taipei", ["臺北", "taipei"]),
  city("tokyo", "东京", "Tokyo", "日本", "Asia/Tokyo", ["東京", "tokyo"]),
  city("singapore", "新加坡", "Singapore", "新加坡", "Asia/Singapore", ["singapore"]),
  city("sydney", "悉尼", "Sydney", "澳大利亚", "Australia/Sydney", ["雪梨", "sydney"]),
  city("melbourne", "墨尔本", "Melbourne", "澳大利亚", "Australia/Melbourne", ["墨爾本", "melbourne"]),
  city("new-york", "纽约", "New York", "美国", "America/New_York", ["紐約", "nyc", "new york"]),
  city("los-angeles", "洛杉矶", "Los Angeles", "美国", "America/Los_Angeles", ["洛杉磯", "la", "los angeles"]),
  city("london", "伦敦", "London", "英国", "Europe/London", ["倫敦", "london"]),
  city("paris", "巴黎", "Paris", "法国", "Europe/Paris", ["paris"]),
];

function city(
  id: string,
  name: string,
  nameEn: string,
  country: string,
  timezoneId: string,
  aliases: string[],
): CityOption {
  return { id, name, nameEn, country, timezoneId, aliases };
}

export function searchCityOptions(query: string): CityOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return CITIES.slice(0, 8);
  return CITIES.filter((item) =>
    [item.name, item.nameEn, item.country, ...item.aliases]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  ).slice(0, 8);
}

export function getCity(cityId: string): CityOption | undefined {
  return CITIES.find((cityOption) => cityOption.id === cityId);
}
