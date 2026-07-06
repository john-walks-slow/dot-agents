---
name: everything-search
description: 使用 Everything 进行极速文件搜索。当你需要在全盘定位文件时使用（优先级高于 grep）。
argument-hint: 搜索关键词或表达式
---

# Skill: everything-search

# Everything 搜索技能

es.exe 是 Everything 搜索引擎的命令行接口，提供毫秒级全盘文件搜索能力。Everything 会实时索引 NTFS 卷上的所有文件和文件夹。

## 基本语法

```bash
es.exe [options] <search text>
```

## 核心搜索语法

### 操作符

| 操作符 | 含义      | 示例                              |
| ------ | --------- | --------------------------------- |
| `空格` | AND（与） | `foo bar` 匹配同时包含 foo 和 bar |
| `\|`   | OR（或）  | `foo\|bar` 匹配 foo 或 bar        |
| `!`    | NOT（非） | `!foo` 排除包含 foo 的结果        |
| `< >`  | 分组      | `<foo\|bar> baz`                  |
| `" "`  | 精确短语  | `"foo bar"` 精确匹配              |

### 通配符

| 通配符 | 含义              | 示例                          |
| ------ | ----------------- | ----------------------------- |
| `*`    | 匹配 0 或多个字符 | `*.mp3` 所有 mp3 文件         |
| `?`    | 匹配单个字符      | `file?.txt` 匹配 file1.txt 等 |

### 常用函数

| 函数            | 用途         | 示例                |
| --------------- | ------------ | ------------------- |
| `ext:<list>`    | 按扩展名过滤 | `ext:mp3;wav`       |
| `size:<size>`   | 按大小过滤   | `size:>100mb`       |
| `dm:<date>`     | 修改日期     | `dm:today`          |
| `dc:<date>`     | 创建日期     | `dc:thisweek`       |
| `parent:<path>` | 限定目录     | `parent:c:\windows` |
| `file:`         | 仅文件       | `file: report`      |
| `folder:`       | 仅文件夹     | `folder: project`   |
| `dupe:`         | 查重名文件   | `dupe: ext:mp3`     |
| `empty:`        | 空文件夹     | `empty:`            |

### 大小语法

```
size:<value>       # 字节
size:<value>kb     # KB
size:<value>mb     # MB
size:<value>gb     # GB
```

大小常量：`empty`, `tiny` (0-10KB), `small` (10-100KB), `medium` (100KB-1MB), `large` (1-16MB), `huge` (16-128MB), `gigantic` (>128MB)

### 日期语法

```bash
dm:today           # 今天修改
dm:yesterday       # 昨天修改
dm:thisweek        # 本周修改
dm:lastmonth       # 上月修改
dm:2024-01-01      # 指定日期
dm:2024-01..2024-06  # 日期范围
```

### 比较操作符

适用于 size、date 等函数：

- `function:value` - 等于
- `function:>value` - 大于
- `function:<value` - 小于
- `function:>=value` - 大于等于
- `function:<=value` - 小于等于
- `function:start..end` - 范围

---

## 场景一：快速文件查找

### 按文件名搜索

```bash
# 搜索文件名包含 report 的文件
es.exe report

# 搜索特定扩展名
es.exe *.pdf

# 搜索多个扩展名
es.exe ext:pdf;doc;docx

# 精确匹配文件名
es.exe "project final.docx"
```

### 限定目录搜索

```bash
# 在特定目录下搜索
es.exe parent:c:\project report

# 搜索子目录
es.exe "c:\users\john\documents\" budget

# 排除某个目录
es.exe log !parent:c:\windows
```

### 按类型搜索

```bash
# 仅文件夹
es.exe folder: project

# 仅文件
es.exe file: config

# 音频文件（宏）
es.exe audio: rock

# 视频文件
es.exe video: mp4

# 图片文件
es.exe pic: sunset

# 压缩文件
es.exe zip:
```

---

## 场景二：大文件与空间管理

### 查找大文件

```bash
# 查找大于 1GB 的文件
es.exe size:>1gb

# 查找最大的 20 个文件
es.exe -sort size -n 20

# 查找某个范围内的大小
es.exe size:100mb..1gb

# 查找特定类型的大文件
es.exe *.mp4 size:>500mb
```

### 查找重复文件

```bash
# 查找同名文件
es.exe dupe:

# 查找同名且大小相同的文件
es.exe dupe: sizedupe:

# 查找特定扩展名的重复
es.exe dupe: ext:mp3

# 查找空文件夹
es.exe empty:
```

---

## 场景三：时间相关搜索

### 按修改时间

```bash
# 今天修改的文件
es.exe dm:today

# 最近 7 天修改
es.exe dm:lastweek

# 本月修改
es.exe dm:thismonth

# 指定日期范围
es.exe dm:2024-01-01..2024-12-31

# 最近修改的 10 个文件
es.exe -sort dm -n 10
```

### 按创建时间

```bash
# 今天创建
es.exe dc:today

# 本周创建
es.exe dc:thisweek
```

---

## 场景四：高级搜索技巧

### 正则表达式搜索

```bash
# 使用正则表达式
es.exe -r "^[A-Z]\d{4}"

# 在搜索中启用正则
es.exe regex:^[a-z]+$
```

### 组合条件

```bash
# AND 组合（空格）
es.exe report ext:pdf dm:thisweek

# OR 组合（|）
es.exe "project report"|"final report"

# NOT 组合（!）
es.exe log !parent:c:\windows

# 复杂组合
es.exe (report\|summary) ext:pdf size:<10mb dm:lastmonth
```

### 内容搜索

```bash
# 搜索文件内容（较慢，需配合其他条件）
es.exe *.log content:"error"

# 指定编码
es.exe *.txt utf8content:"中文"
```

---

## 场景五：输出控制与格式化

### 结果限制

```bash
# 限制结果数量
es.exe report -n 20

# 偏移量（分页）
es.exe report -o 100 -n 50

# 仅显示数量
es.exe report -get-result-count
```

### 排序

```bash
# 按名称排序
es.exe -sort name

# 按大小降序
es.exe -sort-size -sort-descending

# 按修改日期降序
es.exe -sort dm -sort-descending

# DIR 风格排序
es.exe /o-s  # 按大小降序
es.exe /o-d  # 按日期降序
```

### 显示列

```bash
# 显示大小和修改日期
es.exe -size -dm *.pdf

# 显示所有常用列
es.exe -size -dm -dc -attribs

# 显示扩展名
es.exe -ext *.pdf
```

### 导出结果

```bash
# 导出为 CSV
es.exe *.mp3 -export-csv music.csv

# 导出为文本
es.exe report -export-txt results.txt

# 导出为 EFU（Everything 文件列表）
es.exe *.pdf -export-efu pdfs.efu

# 无表头导出
es.exe *.txt -export-csv output.csv -no-header
```

---

## 场景六：实用技巧

### 查找特定属性的文件

```bash
# 只读文件
es.exe attrib:r

# 隐藏文件
es.exe attrib:h

# 系统文件
es.exe attrib:s

# 压缩文件（属性）
es.exe attrib:c

# 排除属性
es.exe /a-r  # 非只读文件
```

### 运行计数相关

```bash
# 查看文件运行次数
es.exe -run-count notepad.exe

# 设置运行计数
es.exe -set-run-count "c:\test.txt" 5

# 增加运行计数
es.exe -inc-run-count "c:\test.txt"
```

### 实用别名（PowerShell）

```powershell
# 添加到 PowerShell profile
function Find-File { es.exe $args }
Set-Alias ff Find-File

# 使用示例
ff "report*.pdf"
ff -size -dm dm:today
```

---

## 常用命令速查

| 需求       | 命令                        |
| ---------- | --------------------------- |
| 查找文件   | `es.exe <keyword>`          |
| 按扩展名   | `es.exe ext:<ext>`          |
| 大于某大小 | `es.exe size:><value>mb`    |
| 最近修改   | `es.exe dm:today`           |
| 指定目录   | `es.exe parent:<path>`      |
| 仅文件夹   | `es.exe folder:`            |
| 查重复     | `es.exe dupe:`              |
| 限结果数   | `es.exe -n <num>`           |
| 排序       | `es.exe -sort <field>`      |
| 导出 CSV   | `es.exe -export-csv <file>` |
| 正则搜索   | `es.exe -r <pattern>`       |
| 显示大小   | `es.exe -size`              |
| 显示日期   | `es.exe -dm`                |

---

## 返回码

| 码  | 说明              |
| --- | ----------------- |
| 0   | 成功              |
| 6   | 未知参数          |
| 8   | Everything 未运行 |

---

## 注意事项

1. **Everything 必须运行**：es.exe 依赖 Everything 后台服务，确保 Everything 已启动（默认开机自启，仅当 es.exe 运行失败时重新检查）
2. **转义规则**：使用双引号转义空格和特殊字符，使用 `^` 转义 `\ & | > < ^`
3. **性能提示**：内容搜索 `content:` 极慢，应先使用其他条件缩小范围
4. **路径分隔符**：Windows 使用 `\`，在命令行中注意转义
5. **结果数量**：默认显示所有结果，大量结果时使用 `-n` 限制

---

## 相关资源

- 官方文档：https://www.voidtools.com/support/everything/command_line_interface/
- 搜索语法：https://www.voidtools.com/support/everything/searching/
- 下载地址：https://www.voidtools.com/downloads/#cli
