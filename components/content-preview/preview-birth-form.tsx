"use client";

import { FormEvent, useId, useState } from "react";
import { searchCityOptions } from "@/data/cities";
import type { BirthInput, CityOption, TimePrecision } from "@/lib/types";
import styles from "./content-preview.module.css";

type PreviewBirthFormProps = {
  readonly onSubmit: (input: BirthInput) => void;
};

export function PreviewBirthForm({ onSubmit }: PreviewBirthFormProps) {
  const cityInputId = useId();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [precision, setPrecision] = useState<TimePrecision>("exact");
  const [cityQuery, setCityQuery] = useState("");
  const [city, setCity] = useState<CityOption | null>(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [error, setError] = useState("");
  const options = searchCityOptions(cityQuery);

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
    <section className={`${styles.card} ${styles.stage}`}>
      <p className={styles.eyebrow}>命盘主导内容预览</p>
      <h1 className={styles.title}>这次，先让命盘说完整。</h1>
      <p className={styles.lead}>
        提交后会直接得到核心结果。问题完全可跳过，只用来补充现实里更常出现的走法。
      </p>

      <form className={styles.form} onSubmit={submit} noValidate>
        <label className={styles.field}>
          <span>出生日期</span>
          <input
            type="date"
            min="1900-01-01"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <fieldset className={styles.precision}>
          <legend>时间记得多清楚？</legend>
          <div className={styles.segmented}>
            {[
              ["exact", "准确"],
              ["approximate", "大概"],
              ["unknown", "不清楚"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="preview-time-precision"
                  checked={precision === value}
                  onChange={() => setPrecision(value as TimePrecision)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {precision !== "unknown" && (
          <label className={styles.field}>
            <span>{precision === "exact" ? "出生时间" : "大概时间"}</span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
            {precision === "approximate" && (
              <small>会保留前后约一小时的合理候选，不假装分秒不差。</small>
            )}
          </label>
        )}

        <div className={styles.cityField}>
          <label htmlFor={cityInputId}>出生城市</label>
          <input
            id={cityInputId}
            role="combobox"
            aria-expanded={cityOpen}
            aria-controls={`${cityInputId}-options`}
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
              className={styles.cityOptions}
              id={`${cityInputId}-options`}
              role="listbox"
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    className={styles.cityOption}
                    type="button"
                    role="option"
                    aria-selected={city?.id === option.id}
                    key={option.id}
                    onClick={() => chooseCity(option)}
                  >
                    <span>
                      <strong>{option.name}</strong>
                      <small>{option.nameEn}</small>
                    </span>
                    <small>{option.country}</small>
                  </button>
                ))
              ) : (
                <p className={styles.emptyOption}>首版城市表里还没有这个地点。</p>
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
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.privacy}>
          <span aria-hidden="true">◌</span>
          <span>不收姓名，不写浏览器记录，不把出生资料放进分享卡。</span>
        </div>

        <button className={styles.primary} type="submit">
          直接看命盘核心结果 →
        </button>
      </form>
    </section>
  );
}
