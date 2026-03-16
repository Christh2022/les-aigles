import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Globe2, Handshake, Heart, ShieldCheck, Users, X } from 'lucide-react'

const DONATION_URL = 'https://www.paypal.me/Lafamillelesaigles?locale.x=fr_FR'

const missionCards = [
  {
    icon: Heart,
    title: 'Aide Sociale de Proximite',
    text: 'Accompagnement des familles vulnerables, soutien materiel et orientation vers les services essentiels.',
  },
  {
    icon: Users,
    title: 'Insertion des Jeunes',
    text: 'Programmes d insertion, mentorat et appui a l employabilite pour les jeunes en situation fragile.',
  },
  {
    icon: Handshake,
    title: 'Formation et Partenariats',
    text: 'Actions de formation et collaboration avec des acteurs locaux pour des projets durables.',
  },
  {
    icon: ShieldCheck,
    title: 'Protection des Plus Demunis',
    text: 'Interventions solidaires pour renforcer la dignite, la securite et l autonomie des beneficiaires.',
  },
]

const zones = [
  {
    title: 'France',
    subtitle: 'Melun et reseau local',
    text: 'Coordination institutionnelle, mobilisation citoyenne et accompagnement social des publics en difficulte.',
  },
  {
    title: 'Congo',
    subtitle: 'Kinshasa et actions terrain',
    text: 'Mise en oeuvre de projets solidaires, accompagnement communautaire et soutien aux initiatives jeunesse.',
  },
]

const imageModules = import.meta.glob('../assets/image/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const videoModules = import.meta.glob('../assets/image/*.{mp4,webm,mov,MP4,WEBM,MOV}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const imageList = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({ path, src }))

const videoList = Object.entries(videoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({ path, src }))

function mediaLabel(path) {
  const fileName = path.split('/').pop() || 'media'
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ')
}

export default function Missions() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null)
  const touchStartX = useRef(0)

  const selectedImage = selectedImageIndex !== null ? imageList[selectedImageIndex] : null
  const selectedVideo = selectedVideoIndex !== null ? videoList[selectedVideoIndex] : null
  const displayedImages = imageList.slice(0, 6)
  const displayedVideos = videoList.slice(0, 6)

  const closeLightbox = () => setSelectedImageIndex(null)
  const closeVideoLightbox = () => setSelectedVideoIndex(null)

  const showPrevImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null || imageList.length === 0) return prev
      return (prev - 1 + imageList.length) % imageList.length
    })
  }

  const showNextImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null || imageList.length === 0) return prev
      return (prev + 1) % imageList.length
    })
  }

  const showPrevVideo = () => {
    setSelectedVideoIndex((prev) => {
      if (prev === null || videoList.length === 0) return prev
      return (prev - 1 + videoList.length) % videoList.length
    })
  }

  const showNextVideo = () => {
    setSelectedVideoIndex((prev) => {
      if (prev === null || videoList.length === 0) return prev
      return (prev + 1) % videoList.length
    })
  }

  useEffect(() => {
    if (selectedImageIndex === null && selectedVideoIndex === null) return undefined

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        closeLightbox()
        closeVideoLightbox()
      }

      if (event.key === 'ArrowLeft') {
        if (selectedImageIndex !== null) showPrevImage()
        if (selectedVideoIndex !== null) showPrevVideo()
      }

      if (event.key === 'ArrowRight') {
        if (selectedImageIndex !== null) showNextImage()
        if (selectedVideoIndex !== null) showNextVideo()
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [selectedImageIndex, selectedVideoIndex])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-primary-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-700">
              <Globe2 className="h-4 w-4" />
              Association internationale
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              Nos Missions
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              La Famille Les Aigles agit pour l education, la formation, l insertion et l aide aux plus demunis,
              avec une approche concrete et humaine entre la France et le Congo.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {missionCards.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {zones.map((zone, index) => (
              <motion.article
                key={zone.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-primary-100 bg-white p-7 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Zone d action</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{zone.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{zone.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{zone.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-7 text-center"
          >
            <h3 className="text-2xl font-extrabold text-gray-900 md:text-3xl">Galerie Missions</h3>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
              Images et videos de nos actions terrain chargees depuis le dossier assets image.
            </p>
          </motion.div>

          {imageList.length > 0 ? (
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary-700">Images</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayedImages.map((item, index) => (
                  <motion.figure
                    key={item.path}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.03 }}
                    className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className="block w-full text-left"
                    >
                      <img
                        src={item.src}
                        alt={mediaLabel(item.path)}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                    <figcaption className="px-3 py-2 text-xs text-slate-600">{mediaLabel(item.path)}</figcaption>
                  </motion.figure>
                ))}
              </div>

              {imageList.length > 6 ? (
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex(0)}
                    className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                  >
                    Voir plus
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {videoList.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary-700">Videos</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {displayedVideos.map((item, index) => (
                  <motion.figure
                    key={item.path}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedVideoIndex(index)}
                      className="block w-full text-left"
                    >
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-64 w-full bg-black object-cover"
                      />
                    </button>
                    <figcaption className="px-3 py-2 text-xs text-slate-600">{mediaLabel(item.path)}</figcaption>
                  </motion.figure>
                ))}
              </div>

              {videoList.length > 6 ? (
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedVideoIndex(0)}
                    className="inline-flex items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                  >
                    Voir plus
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {imageList.length === 0 && videoList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-6 text-center text-sm text-slate-500">
              Aucun media detecte dans src/assets/image.
            </div>
          ) : null}
        </div>
      </section>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Apercu image"
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX
            }}
            onTouchEnd={(event) => {
              const delta = event.changedTouches[0].clientX - touchStartX.current
              if (Math.abs(delta) < 50) return
              if (delta > 0) showPrevImage()
              if (delta < 0) showNextImage()
            }}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800"
            >
              <X className="h-4 w-4" /> Fermer
            </button>

            <button
              type="button"
              onClick={showPrevImage}
              className="absolute left-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-800 shadow"
              aria-label="Image precedente"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-800 shadow"
              aria-label="Image suivante"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <img
              src={selectedImage.src}
              alt={mediaLabel(selectedImage.path)}
              className="max-h-[85vh] w-full rounded-2xl object-contain"
            />
            <p className="mt-3 text-center text-xs text-white/90">
              {mediaLabel(selectedImage.path)} ({selectedImageIndex + 1}/{imageList.length})
            </p>
          </div>
        </div>
      ) : null}

      {selectedVideo ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={closeVideoLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Apercu video"
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX
            }}
            onTouchEnd={(event) => {
              const delta = event.changedTouches[0].clientX - touchStartX.current
              if (Math.abs(delta) < 50) return
              if (delta > 0) showPrevVideo()
              if (delta < 0) showNextVideo()
            }}
          >
            <button
              type="button"
              onClick={closeVideoLightbox}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800"
            >
              <X className="h-4 w-4" /> Fermer
            </button>

            <button
              type="button"
              onClick={showPrevVideo}
              className="absolute left-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-800 shadow"
              aria-label="Video precedente"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNextVideo}
              className="absolute right-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-gray-800 shadow"
              aria-label="Video suivante"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <video
              src={selectedVideo.src}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] w-full rounded-2xl bg-black object-contain"
            />
            <p className="mt-3 text-center text-xs text-white/90">
              {mediaLabel(selectedVideo.path)} ({selectedVideoIndex + 1}/{videoList.length})
            </p>
          </div>
        </div>
      ) : null}

      <section className="pb-16 pt-10 md:pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-10 text-center text-white shadow-lg md:px-10"
          >
            <h4 className="text-2xl font-extrabold md:text-3xl">Agir avec nous</h4>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
              Votre soutien permet de financer des actions sociales utiles et de renforcer notre impact sur le terrain.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-700 transition hover:bg-blue-50"
              >
                Faire un don <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/evenements"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voir nos evenements
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
