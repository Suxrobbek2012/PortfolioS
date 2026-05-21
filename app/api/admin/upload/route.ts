import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL
  if (cloudinaryUrl) {
    const url = new URL(cloudinaryUrl)
    const cloudName = url.hostname
    const username = url.username
    const password = url.password
    if (cloudName && username && password) {
      return { cloudName, apiKey: username, apiSecret: password }
    }
  }

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    }
  }

  return null
}

async function uploadToImgBB(buffer: Buffer, filename: string) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) throw new Error('IMGBB_API_KEY is not configured')

  const form = new URLSearchParams()
  form.append('key', apiKey)
  form.append('image', buffer.toString('base64'))
  form.append('name', filename)

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: form,
  })
  const data = await res.json()

  if (!res.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || 'ImgBB upload failed')
  }

  return data.data.url as string
}

async function uploadToCloudinary(buffer: Buffer, filename: string, fileType: string) {
  const config = getCloudinaryConfig()
  if (!config) throw new Error('Cloudinary is not configured')

  const { cloudName, apiKey, apiSecret } = config
  const form = new FormData()
  form.append('file', `data:${fileType};base64,${buffer.toString('base64')}`)
  form.append('public_id', filename)

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  const data = await res.json()

  if (!res.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed')
  }

  return data.secure_url as string
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF allowed' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `project_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const cloudinaryConfig = getCloudinaryConfig()
    const useImgBB = Boolean(process.env.IMGBB_API_KEY)
    const useCloudinary = Boolean(cloudinaryConfig)
    const canWriteLocal = !process.env.VERCEL

    if (useImgBB || useCloudinary) {
      const imageUrl = useImgBB
        ? await uploadToImgBB(buffer, filename)
        : await uploadToCloudinary(buffer, filename, file.type)

      return NextResponse.json({ url: imageUrl, filename })
    }

    if (!canWriteLocal) {
      return NextResponse.json({ error: 'File upload is disabled on Vercel without external storage. Set IMGBB_API_KEY or CLOUDINARY_URL.' }, { status: 500 })
    }

    // Local filesystem upload for development / non-Vercel deployment
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    try {
      await mkdir(uploadDir, { recursive: true })
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)

      return NextResponse.json({ url: `/uploads/projects/${filename}`, filename })
    } catch (fsError: unknown) {
      console.error('Upload filesystem error:', fsError)
      return NextResponse.json({ error: 'Failed to save uploaded image to disk.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
