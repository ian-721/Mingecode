type BoundaryNoticeProps = {
  notices: string[];
  onContinue: () => void;
  onEdit: () => void;
};

export function BoundaryNotice({
  notices,
  onContinue,
  onEdit,
}: BoundaryNoticeProps) {
  return (
    <section className="stage-card notice-stage">
      <div className="boundary-symbol" aria-hidden="true">
        界
      </div>
      <p className="eyebrow">时间边界提示</p>
      <h1>这次不硬猜</h1>
      <p className="notice-intro">
        有些出生时间刚好靠近换日、时辰或节气边界。后台会保留合理版本，结果只说它们共同支持的部分。
      </p>
      <ul className="notice-list">
        {notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
      <div className="button-row">
        <button className="button button-primary" onClick={onContinue}>
          明白，继续
        </button>
        <button className="button button-ghost" onClick={onEdit}>
          返回修改
        </button>
      </div>
    </section>
  );
}

export function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="stage-card notice-stage" role="alert">
      <div className="boundary-symbol error-symbol" aria-hidden="true">
        ！
      </div>
      <p className="eyebrow">这次没算下去</p>
      <h1>不是你的资料有问题</h1>
      <p className="notice-intro">{message}</p>
      <button className="button button-primary" onClick={onRetry}>
        返回输入
      </button>
    </section>
  );
}
