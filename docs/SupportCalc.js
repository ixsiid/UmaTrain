const _param = {
	"友情ボーナス": 0,
	"やる気効果アップ": 0,
	"初期絆ゲージアップ": 0,
	"得意率アップ": 0,
	"トレーニング効果アップ": 0,
	"トレーニングボーナス": null, 
};

const _train_count = {
	"スピード": 0,
	"スタミナ": 0,
	"パワー": 0,
	"根性": 0,
	"賢さ": 0,
};

const kind_list = ["スピード", "スタミナ", "パワー", "根性", "賢さ"];

export function support_calculate(kind, param = _param, train_count = _train_count) {
	if (kind_list.indexOf(kind) < 0) throw "得意の種類がおかしいよ";

	const result = {};
	result.appearance = {
		"スピード": 100,
		"スタミナ": 100,
		"パワー": 100,
		"根性": 100,
		"賢さ": 100,
		"お休み": 50,
	};
	result.appearance[kind] += param["得意率アップ"];
	const appearance_rate_denominator = Object.values(result.appearance).reduce((a, b) => a + b, 0);
	result.appearance_rate = Object.fromEntries(Object.entries(result.appearance).map(([k, v]) => ([k, v / appearance_rate_denominator])));

	return result;
}
