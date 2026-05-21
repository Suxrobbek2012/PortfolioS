import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Create upload directory (if possible)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    try {
      await mkdir(uploadDir, { recursive: true })

      // Sanitize filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filename = `project_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      return NextResponse.json({
        url: `/uploads/projects/${filename}`,
        filename,
      })
    } catch (fsError) {
      console.error('Upload filesystem error:', fsError)

      // If running on a platform with read-only filesystem (Vercel, some serverless), provide guidance
      const isReadOnly = fsError && (fsError.code === 'EROFS' || fsError.message?.toLowerCase?.().includes('read-only'))

      const guidance = isReadOnly || process.env.VERCEL
        ? 'Server filesystem is read-only on this deployment. Configure external storage (e.g., Cloudinary, S3) and update the upload handler.'
        : 'Failed to write file to disk.'

      return NextResponse.json({ error: guidance }, { status: 500 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
