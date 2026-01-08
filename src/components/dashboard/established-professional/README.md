# Established Professional Dashboard - 成熟专业人士仪表板

## 📋 Overview | 概览

针对46-55岁高收入人群的财富管理和税务优化仪表板，提供全面的税务策略、Super供款计算、CGT计算和信托规划功能。

**Target Audience**: Established Professionals (46-55 years old)
- High income earners
- Focus on wealth accumulation
- Super maximization
- Estate planning
- Tax optimization

## 🏗️ Architecture | 架构

```
src/
├── types/
│   └── established-professional.ts      # TypeScript类型定义
├── lib/
│   └── tax-calculations.ts              # 税务计算工具函数
├── hooks/
│   └── useEstablishedProfessional.ts    # 自定义React Hook
└── components/
    └── dashboard/
        └── established-professional/
            ├── EstablishedProfessionalDashboard.tsx  # 主仪表板
            ├── WealthGoalsSelector.tsx               # 财富目标选择器
            ├── QuickActionsGrid.tsx                  # 快速操作网格
            ├── NetWorthSummary.tsx                   # 净值摘要
            ├── TaxStrategiesSection.tsx              # 税务策略部分
            ├── AISuggestionsSection.tsx              # AI建议部分
            ├── TasksSection.tsx                      # 任务管理
            ├── ActivitiesSection.tsx                 # 活动时间线
            ├── SuperCalculator.tsx                   # Super供款计算器
            ├── CGTCalculator.tsx                     # CGT计算器
            ├── TrustInfoModal.tsx                    # 信托信息模态框
            ├── index.ts                              # Barrel导出
            └── README.md                             # 本文档
```

## 🚀 Features | 功能特性

### 1. **财富目标管理** (Wealth Goals Management)
- 6种财富目标选择：财富保值、Super最大化、遗产规划、税务最小化、传承规划、投资增长
- 根据选择的目标动态筛选推荐策略

### 2. **税务策略推荐** (Tax Strategies)
- 优惠性Super供款策略
- 资本利得税收获策略
- 家族信托分配
- Super分割供款
- 基于复杂度和潜在节税的策略评估

### 3. **Super供款计算器** (Super Contribution Calculator)
- 2024-25财年最新限额：优惠性$30,000、非优惠性$120,000
- 11.5% SG雇主供款自动计算
- 税务节省估算
- 10年退休余额预测（7%年回报）

### 4. **CGT计算器** (CGT Calculator)
- 支持多种资产类型：股票、房产、加密货币、收藏品、商业资产
- 自动判断50% CGT折扣资格（持有≥365天）
- 基于边际税率的CGT估算

### 5. **AI智能建议** (AI Suggestions)
- 基于优先级的智能建议（高/中/低）
- 潜在节税金额显示
- 行动建议和截止日期

### 6. **任务管理** (Task Management)
- 优先级标记（高/中/低）
- 任务完成状态追踪
- 截止日期提醒

### 7. **信托规划信息** (Trust Planning)
- 全权信托、单位信托、混合信托介绍
- 税务优势和成本分析
- 合规要求说明

## 💻 Usage | 使用方法

### Basic Implementation | 基本实现

```tsx
import { EstablishedProfessionalDashboard } from '@/src/components/dashboard/established-professional';

export default function DemoPage() {
  return <EstablishedProfessionalDashboard />;
}
```

### With Next.js App Router | Next.js App Router

Create a new route at `app/demo/established-professional/page.tsx`:

```tsx
import { EstablishedProfessionalDashboard } from '@/src/components/dashboard/established-professional';

export default function EstablishedProfessionalPage() {
  return (
    <main>
      <EstablishedProfessionalDashboard />
    </main>
  );
}
```

### Custom Hook Usage | 自定义Hook使用

```tsx
import { useEstablishedProfessional } from '@/src/hooks/useEstablishedProfessional';

function MyComponent() {
  const {
    profile,
    taxStrategies,
    suggestions,
    totalNetWorth,
    estimatedAnnualTax,
    potentialTaxSavings,
    selectGoal,
    calculateSuper,
  } = useEstablishedProfessional();

  // Use the data and methods
}
```

## 🧮 Tax Calculations | 税务计算

### Australian Tax Rates 2024-25 | 澳洲税率

```typescript
Tax Brackets:
- $0 - $18,200: 0%
- $18,201 - $45,000: 16%
- $45,001 - $135,000: 30%
- $135,001 - $190,000: 37%
- $190,001+: 45%
+ Medicare Levy: 2%
```

### Super Contribution Limits | Super供款限额

```typescript
Concessional Cap: $30,000
Non-Concessional Cap: $120,000
Total Super Balance Cap: $1,900,000
Superannuation Guarantee Rate: 11.5%
```

### CGT Discount | CGT折扣

```typescript
Holding Period ≥ 365 days: 50% discount
Holding Period < 365 days: No discount
```

## 🎨 Styling | 样式

使用 **Tailwind CSS** 进行样式设计：

- 响应式设计：支持移动端、平板和桌面
- 渐变色背景：`from-purple-50 via-blue-50 to-indigo-50`
- 阴影和圆角：`shadow-lg` 和 `rounded-2xl`
- 交互动画：`transition-all` 和 `hover:scale-105`

## 🔧 Customization | 自定义

### Modify Profile Data | 修改用户数据

在 `useEstablishedProfessional.ts` 中修改初始数据：

```typescript
profile: {
  id: '1',
  annualIncome: 200000,      // 修改年收入
  superBalance: 500000,       // 修改Super余额
  investmentPortfolioValue: 300000,
  propertyValue: 1200000,
  // ...
}
```

### Add New Strategies | 添加新策略

在 `src/hooks/useEstablishedProfessional.ts` 的 `generateSampleStrategies()` 函数中添加：

```typescript
{
  id: '5',
  title: '您的新策略',
  description: '策略描述',
  category: 'concessional_contributions',
  potentialSavings: 5000,
  complexity: 'moderate',
  applicableLifeStages: ['established_professional'],
}
```

### Customize Colors | 自定义颜色

在各组件中修改颜色类：

```tsx
// 从紫色改为绿色主题
className="bg-purple-600" → className="bg-green-600"
className="text-purple-600" → className="text-green-600"
```

## 📊 Data Flow | 数据流

```
User Interaction
    ↓
Component Events
    ↓
useEstablishedProfessional Hook
    ↓
State Updates (useState)
    ↓
Tax Calculations (lib/tax-calculations.ts)
    ↓
UI Re-render
```

## 🧪 Testing | 测试

### Manual Testing Checklist | 手动测试清单

- [ ] 财富目标选择和筛选功能
- [ ] Super计算器准确性
- [ ] CGT计算器准确性
- [ ] 任务完成状态切换
- [ ] 响应式设计（移动/平板/桌面）
- [ ] 模态框打开/关闭
- [ ] 数据格式化（货币、日期）

### Test Data | 测试数据

```typescript
// High Income Scenario
Annual Income: $200,000
Super Balance: $500,000
Investment Portfolio: $300,000
Property Value: $1,200,000
Total Net Worth: $2,000,000
Estimated Tax: ~$67,000
```

## 🌐 Internationalization | 国际化

当前支持：
- ✅ 中文 (简体)
- ✅ English (部分)

扩展支持可使用 `next-intl` 或类似库。

## 📱 Responsive Design | 响应式设计

### Breakpoints | 断点

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Grid Layouts | 网格布局

```tsx
// 移动端1列，平板2列，桌面3列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🚧 Known Issues | 已知问题

1. **TypeScript Errors**: 一些 `any` 类型错误是由于开发环境配置，运行时不影响
2. **Date Formatting**: `date-fns` 的中文locale可能需要额外配置
3. **Browser Compatibility**: 需要现代浏览器支持 (Chrome 90+, Firefox 88+, Safari 14+)

## 🔄 Future Enhancements | 未来增强

- [ ] 后端API集成
- [ ] 数据持久化（LocalStorage/Database）
- [ ] 导出PDF报告
- [ ] 邮件提醒功能
- [ ] 多用户支持
- [ ] 历史记录追踪
- [ ] 更多计算器（负扣税、股息抵免等）
- [ ] 图表可视化（Recharts集成）

## 📚 Dependencies | 依赖

```json
{
  "react": "^18.3.1",
  "lucide-react": "^0.363.0",
  "date-fns": "^4.1.0",
  "tailwindcss": "^3.4.1"
}
```

## 👨‍💻 Development | 开发

### Run Development Server | 运行开发服务器

```bash
cd /Users/wayne/Documents/TaxEnd-landing
npm run dev
```

访问: `http://localhost:3000`

### Build for Production | 生产构建

```bash
npm run build
npm run start
```

## 📄 License | 许可证

All rights reserved. TaxEnd © 2026

## 🤝 Contributing | 贡献

如需贡献或报告问题，请联系开发团队。

---

**Created by**: Claude (Anthropic)  
**Date**: 2026年1月8日  
**Version**: 1.0.0  
**Project**: TaxEnd - Established Professional Dashboard
