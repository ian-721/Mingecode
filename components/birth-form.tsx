"use client";

import { FormEvent, useId, useState } from "react";
import { searchCityOptions } from "@/data/cities";
import type { BirthInput, CityOption, TimePrecision } from "@/lib/types";

type BirthFormProps = {
  onSubmit: (input: BirthInput) => void;
};

export function BirthForm({ onSubmit }: BirthFormProps) {
  const listId = useId();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [precision, setPrecision] = useState<TimePrecision>("exact");
  const [cityQuery, setCityQuery] = useState("");
  const [city, setCity] = useState<CityOption | null>(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [error, setError] = useState("");
  const cityOptions = searchCityOptions(cityQuery);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !city || (precision !== "unknown" && !time)) {
      setError("请把日期、时间状态和出生城市补完整。");
      return;
    }
    setError("");
    onSubmit({
      date,
      time: precision === "unknown" ? null : time,
      timePrecision: precision,
      cityId: city.id,
    });
  }

  function chooseCity(option: CityOption) {
    setCity(option);
    setCityQuery(`${option.name} · ${option.country}`);
    setCityOpen(false);
  }

  return (
    <section className="stage-card birth-stage">
      <div className="stage-heading">
        <p className="eyebrow">第一步 · 放回出生现场</p>
        <h1>你的出生时间，按哪座城市的钟走？</h1>
        <p>只在当前页面计算。刷新之后，这些资料就不在了。</p>
      </div>

      <form className="birth-form" onSubmit={submit} noValidate>
        <label className="field">
          <span>出生日期</span>
          <input
            type="date"
            value={date}
            min="1900-01-01"
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <fieldset className="precision-field">
          <legend>时间记得多清楚？</legend>
          <div className="segmented-control">
            {[
              ["exact", "准确"],
              ["approximate", "大概"],
              ["unknown", "不清楚"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="time-precision"
                  value={value}
                  checked={precision === value}
                  onChange={() => setPrecision(value as TimePrecision)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {precision !== "unknown" && (
          <label className="field">
            <span>{precision === "exact" ? "出生时间" : "大概时间"}</span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
            {precision === "approximate" && (
              <small>会把前后约一小时一起考虑，不装作分秒不差。</small>
            )}
          </label>
        )}

        <div className="field city-field">
          <label htmlFor={listId}>出生城市</label>
          <input
            id={listId}
            role="combobox"
            aria-expanded={cityOpen}
            aria-controls={`${listId}-options`}
            aria-autocomplete="list"
            autoComplete="off"
            placeholder="输入中文或英文城市名"
            value={cityQuery}
            onFocus={() => setCityOpen(true)}
            onChange={(event) => {
              setCityQuery(event.target.value);
              setCity(null);
              setCityOpen(true);
            }}
          />
          {cityOpen && (
            <div
              className="city-options"
              id={`${listId}-options`}
              role="listbox"
            >
              {cityOptions.length > 0 ? (
                cityOptions.map((option) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={city?.id === option.id}
                    key={option.id}
                    onClick={() => chooseCity(option)}
                  >
                    <span>
                      <strong>{option.name}</strong>
                      {option.nameEn}
                    </span>
                    <small>{option.country}</small>
                  </button>
                ))
              ) : (
                <p>首版城市表里还没有这个地点。</p>
              )}
            </div>
          )}
          {city && (
            <small>
              已选择 {city.nameEn} · {city.timezoneId}
            </small>
          )}
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="privacy-strip">
          <span aria-hidden="true">◌</span>
          <p>
            不收姓名，不写浏览器记录，不把出生资料放进分享卡。
          </p>
        </div>

        <button className="button button-primary button-block" type="submit">
          生成候选，去答三题
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="copy-version">当前文字为 demo-copy-v0.1，并非正式文案。</p>
    </section>
  );
}
