import { useEffect, useState } from 'react'

const projects = [
  {
    id: '01',
    title: '零三号隘口',
    en: 'OUTPOST 03',
    type: 'UE ENVIRONMENT · LEVEL ART',
    image: '/portfolio/resume-03.jpg',
    note: '一处被自然重新占领的近未来军事关卡。围绕空间动线、战场叙事与昼夜氛围进行场景构建。',
    tags: ['Unreal Engine', 'PBR Workflow', 'Lighting'],
  },
  {
    id: '02',
    title: '沃森区食驿',
    en: 'FOREST FOOD STATION',
    type: 'STYLIZED PROP · FULL PIPELINE',
    image: '/portfolio/resume-06.jpg',
    note: '带有东方语汇的风格化场景道具，从概念拆解、建模到贴图与最终呈现。',
    tags: ['Maya', 'Substance 3D', 'Marmoset'],
  },
  {
    id: '03',
    title: '蜂鸣-A04',
    en: 'BUZZ A04',
    type: 'HARD SURFACE · VEHICLE',
    image: '/portfolio/resume-10.jpg',
    note: '小型科幻载具设计，以清晰功能分区和模块化结构建立可靠的机械语言。',
    tags: ['Hard Surface', 'Vehicle Design', 'Baking'],
  },
  {
    id: '04',
    title: '望轩阁',
    en: 'WANGXUAN PAVILION',
    type: 'ARCHITECTURE · PBR ASSET',
    image: '/portfolio/resume-17.jpg',
    note: '以传统建筑结构为基础的游戏资产，关注比例、轮廓与材质层次的统一。',
    tags: ['Architecture', 'Modular Asset', 'Texturing'],
  },
  {
    id: '05',
    title: '云螭断鸿',
    en: 'CLOUD CHI BLADE',
    type: 'WEAPON PROP · PBR ASSET',
    image: '/portfolio/resume-14.jpg?v=20260813-2',
    note: '东方幻想风格刀具资产，围绕雕花结构、金属层次与使用痕迹塑造兼具装饰性和可信度的武器道具。',
    tags: ['Weapon Art', 'PBR Texturing', 'Ornament Design'],
  },
  {
    id: '06',
    title: '造型基础',
    en: 'ART FOUNDATION',
    type: 'VISUAL FOUNDATION · STUDY',
    image: '/portfolio/resume-23.jpg',
    note: '持续训练造型、结构、透视、明暗与色彩基础，在观察和手绘中积累审美判断，为三维场景的空间关系与视觉表达打牢根基。',
    tags: ['Form Study', 'Perspective', 'Color'],
  },
]

const strengths = [
  ['01', '好看≠好玩', '从叙事目标出发规划构图、动线与视觉层级，让场景不只“好看”，也能够被游玩。'],
  ['02', 'PBR ⇄ UE', '熟悉 PBR 次世代资产制作，熟悉引擎工作流，能够快速上手适配项目工作。'],
  ['03', '风格适应性', '能够在写实、科幻与东方风格之间切换，保持资产语言与项目视觉方向一致。'],
  ['04', '能力复制性', '善于解决问题，乐于帮助他人解决问题，教会他人解决问题。'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

const projectCasePages = {
  '01': ['/portfolio/resume-03.jpg', '/portfolio/resume-04.jpg', '/portfolio/resume-05.jpg'],
  '02': ['/portfolio/resume-06.jpg', '/portfolio/resume-07.jpg', '/portfolio/resume-08.jpg', '/portfolio/resume-09.jpg'],
  '03': ['/portfolio/resume-10.jpg', '/portfolio/resume-11.jpg', '/portfolio/resume-12.jpg', '/portfolio/resume-13.jpg'],
  '04': ['/portfolio/resume-17.jpg', '/portfolio/resume-18.jpg', '/portfolio/resume-19.jpg'],
  '05': ['/portfolio/resume-14.jpg?v=20260813-2', '/portfolio/resume-15.jpg?v=20260813-2', '/portfolio/resume-16.jpg?v=20260813-2'],
  '06': ['/portfolio/resume-23.jpg'],
}

function CapabilityIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    '01': <><path d="M7 17V8h9M32 8h9v9M41 31v9h-9M16 40H7v-9"/><path d="M11 33l8-10 6 5 7-12 5 17"/><path d="M11 33h26"/></>,
    '02': <><path d="M24 7 39 15.5 24 24 9 15.5 24 7Z"/><path d="m9 23 15 8.5L39 23M9 30.5 24 40l15-9.5"/><path d="M24 24v16"/></>,
    '03': <><path d="M8 13h22v22H8zM18 8h22v22"/><path d="m31 34 2.5 5 2.5-5 5-2.5-5-2.5-2.5-5-2.5 5-5 2.5 5 2.5Z"/></>,
    '04': <><circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="4"/><path d="m24 24 8-10M32 14l-1 7M32 14l-7 1M24 8v4M40 24h-4M24 40v-4M8 24h4"/></>,
  }
  return <svg className="cap-svg" viewBox="0 0 48 48" aria-hidden="true" {...common}>{icons[type]}</svg>
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeCase, setActiveCase] = useState(null)
  const [activeCasePage, setActiveCasePage] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!activeCase) return undefined
    const pages = projectCasePages[activeCase.id]
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveCase(null)
      if (event.key === 'ArrowRight') setActiveCasePage(page => (page + 1) % pages.length)
      if (event.key === 'ArrowLeft') setActiveCasePage(page => (page - 1 + pages.length) % pages.length)
    }
    document.body.classList.add('case-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('case-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeCase])

  const openCase = (project) => {
    setActiveCasePage(0)
    setActiveCase(project)
  }

  const displayedProjects = [projects[0], projects[1], projects[2], projects[4], projects[3], projects[5]]

  return (
    <main>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <a className="brand" href="#top" aria-label="返回首页">
          <span>靳煜飞</span>
        </a>
        <nav aria-label="主导航">
          <a href="#top">首页</a>
          <a href="#about">关于我</a>
          <a href="#work">作品集</a>
          <a href="#learning">学习方法</a>
          <a href="#strengths">个人优势</a>
          <a href="#contact">联系方式</a>
        </nav>
        <a
          className="portfolio-download"
          href="/portfolio/jinyufei-3d-portfolio.pdf"
          download="靳煜飞-3D场景作品集.pdf"
          aria-label="下载靳煜飞的最新作品集 PDF"
        >
          <span>作品集下载</span>
          <Arrow />
        </a>
        <span className="nav-scroll-hint" aria-hidden="true" />
      </header>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true">
          <div className="hero-video-blur" />
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/outpost-03-poster.jpg"
          >
            <source src="/media/outpost-03-hero.mp4" type="video/mp4" />
          </video>
          <div className="scanline" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content shell">
          <h1 className="hero-poster-title">3D场景</h1>
          <div className="hero-eyebrow"><span>PORTFOLIO</span><span>XI'AN · CHINA</span></div>
          <div className="hero-title-wrap">
            <div className="hero-title-side">
              <span>ENVIRONMENT</span>
              <span>REAL-TIME</span>
              <span>WORLD BUILDING</span>
            </div>
            <div className="hero-statement">
              <span className="statement-line">WE BUILD</span>
              <span className="statement-line accent">WORLDS,</span>
              <span className="statement-line outline">NOT BACKDROPS.</span>
            </div>
            <p className="hero-cn">不止制作背景，<br />而是塑造可以被探索的世界。</p>
          </div>
          <div className="hero-bottom">
            <div className="hero-contact">
              <span>CONTACT</span>
              <a href="mailto:188421520@qq.com">188421520@qq.com</a>
              <a href="tel:+8619160243320">+86 191 6024 3320</a>
            </div>
            <span className="hero-index">JIN YUFEI®<br />PORTFOLIO / 2026</span>
            <p>聚焦游戏场景、硬表面资产与实时引擎表现，<br />在功能与氛围之间建立可信的空间。</p>
          </div>
        </div>
        <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
      </section>

      <section className="about section shell" id="about">
        <div className="section-kicker"><span>01</span><p>PROFILE / 个人介绍</p><div className="section-summary">专注游戏 3D 场景设计，关注空间叙事、氛围塑造与资产复用。</div></div>
        <div className="about-grid">
          <div className="portrait" role="img" aria-label="靳煜飞个人照片">
            <img src="/portfolio/resume-02.jpg" alt="靳煜飞个人经历与简历信息" loading="lazy" />
          </div>
          <div className="about-copy">
            <p className="overline">HELLO, I'M JIN YUFEI</p>
            <h2>用空间，讲述<span>故事。</span></h2>
            <p className="about-lead">我是靳煜飞，专注游戏 3D 场景设计。熟悉 PBR 与 Unreal Engine 制作流程，关注空间叙事、氛围塑造与资产复用。</p>
            <div className="experience-row">
              <div><small>学校</small><strong>西安美术学院</strong><p>动画专业 · 本科</p></div>
              <div><small>岗位</small><strong>3D场景设计</strong><p>Environment / Props</p></div>
              <div><small>年级</small><strong>2028届</strong><p>Available for opportunities</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects section" id="work">
        <div className="shell">
          <div className="section-kicker"><span>02</span><p>SELECTED WORKS / 个人作品</p><div className="section-summary">精选场景、载具与道具作品，从设计逻辑到引擎呈现，建立完整视觉叙事。</div></div>
          <nav className="project-jump-nav" aria-label="作品快速导航">
            {displayedProjects.map((project, index) => (
              <a href={`#project-${project.id}`} key={project.id} aria-label={`跳转到作品 ${String(index + 1).padStart(2, '0')}：${project.title}`}>
                <img src={project.image} alt="" loading="lazy" />
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{project.title}</strong>
              </a>
            ))}
          </nav>
          <div className="project-list">
            {displayedProjects.map((project, index) => (
              <article className="project-card" id={`project-${project.id}`} key={project.id}>
                <div className="project-meta">
                  <span className="project-number">/{String(index + 1).padStart(2, '0')}</span>
                  <div><small>{project.type}</small><h3>{project.title} <i>{project.en}</i></h3></div>
                  <p>{project.note}</p>
                  <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                </div>
                <div className="project-image-wrap">
                  <img src={project.image} alt={`${project.title}作品展示`} loading={index > 0 ? 'lazy' : 'eager'} />
                </div>
                <button className="project-overlay" type="button" onClick={() => openCase(project)} aria-label={`查看 ${project.title} 完整案例`}><span>作品详情</span><Arrow /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="learning section" id="learning">
        <div className="shell">
          <div className="section-kicker"><span>04</span><p>LEARNING HABITS / 学习习惯</p><div className="section-summary">主动建立知识结构、记录实践过程，并用长期训练校准自己的视觉判断。</div></div>
          <div className="learning-list">
            <article className="learning-card">
              <div className="learning-meta"><span>01 / LEARNING PROCESS</span><h3>学习过程</h3><p>主动整理 PBR 流程与制作问题，通过公开分享获取反馈；从白模、模块管理到材质与灯光建立过程记录，并在项目完成后持续复盘，让学习经验沉淀为可复用的方法。</p></div>
              <div className="learning-media-pair">
                <img src="/portfolio/resume-21.jpg" alt="PBR流程学习笔记与公开分享" loading="lazy" />
                <img src="/portfolio/resume-22.jpg" alt="UE场景学习过程与方法记录" loading="lazy" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="strengths section shell" id="strengths">
        <div className="section-kicker"><span>05</span><p>CAPABILITIES / 个人优势</p><div className="section-summary">建立稳定流程，也保留对画面、体验和细节的敏感。</div></div>
        <div className="strength-grid">
          {strengths.map(([no, title, copy]) => (
            <article key={no}><span>{no}</span><div className="cap-icon"><CapabilityIcon type={no} /></div><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="tool-marquee" aria-label="常用软件">
          <span>UNREAL ENGINE</span><i>✦</i><span>3D MAX</span><i>✦</i><span>SUBSTANCE 3D</span><i>✦</i><span>MARMOSET</span><i>✦</i><span>PHOTOSHOP</span>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-bg" aria-hidden="true" />
        <div className="shell contact-inner">
          <div className="section-kicker light"><span>06</span><p>CONTACT / 保持联系</p><div className="section-summary">如果你正在寻找一名重视画面、流程与协作的场景设计师——</div></div>
          <div className="contact-bottom">
            <div><small>E-MAIL</small><a href="mailto:188421520@qq.com">188421520@qq.com</a></div>
            <div><small>PHONE</small><a href="tel:+8619160243320">+86 191 6024 3320</a></div>
            <p>靳煜飞 · 3D ENVIRONMENT ARTIST<br />© 2026 PORTFOLIO</p>
          </div>
        </div>
      </footer>
      {activeCase && (
        <div className="case-viewer" role="dialog" aria-modal="true" aria-label={`${activeCase.title} 完整案例`}>
          <header className="case-viewer-head">
            <div><small>PROJECT CASE / {activeCase.id}</small><strong>{activeCase.title} <i>{activeCase.en}</i></strong></div>
            <div className="case-progress"><span>{String(activeCasePage + 1).padStart(2, '0')}</span> / {String(projectCasePages[activeCase.id].length).padStart(2, '0')}</div>
            <button type="button" onClick={() => setActiveCase(null)} aria-label="关闭案例">CLOSE ×</button>
          </header>
          <div className="case-stage">
            <img src={projectCasePages[activeCase.id][activeCasePage]} alt={`${activeCase.title} 案例第 ${activeCasePage + 1} 页`} />
          </div>
          <div className="case-pagination" aria-label="案例翻页">
            <button className="case-nav prev" type="button" onClick={() => setActiveCasePage(page => (page - 1 + projectCasePages[activeCase.id].length) % projectCasePages[activeCase.id].length)} aria-label="上一页"><span>←</span><small>上一页</small></button>
            <div><strong>{String(activeCasePage + 1).padStart(2, '0')}</strong><i>/</i><span>{String(projectCasePages[activeCase.id].length).padStart(2, '0')}</span></div>
            <button className="case-nav next" type="button" onClick={() => setActiveCasePage(page => (page + 1) % projectCasePages[activeCase.id].length)} aria-label="下一页"><small>下一页</small><span>→</span></button>
          </div>
          <div className="case-thumbs">
            {projectCasePages[activeCase.id].map((page, pageIndex) => (
              <button type="button" className={pageIndex === activeCasePage ? 'is-active' : ''} onClick={() => setActiveCasePage(pageIndex)} key={page} aria-label={`查看第 ${pageIndex + 1} 页`}>
                <img src={page} alt="" />
                <span>{String(pageIndex + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
