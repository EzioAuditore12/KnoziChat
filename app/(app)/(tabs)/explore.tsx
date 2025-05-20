import React, { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '@/providers/AuthProvider'
import Avatar from '@/components/User/Avatar'
export default function Account() {
  const {session}=useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullname,setFullname]=useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url,full_name`)
        .eq('id', session.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url,full_name }: { username: string; website: string; avatar_url: string; full_name:string }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems:'center'}}>
      <Avatar
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url)
          updateProfile({ 
            username, 
            website, 
            avatar_url: url, 
            full_name:fullname
          })
        }}
      />
    </View>
      <LabeledInput label="Fullname" value={fullname} onChangeText={setFullname} />
      <LabeledInput label="Email" value={session?.user?.email ?? ''} editable={false} />
      <LabeledInput label="Username" value={username} onChangeText={setUsername} />
      <LabeledInput label="Website" value={website} onChangeText={setWebsite} />
      <View style={styles.spacer} />
      <CustomButton title={loading ? 'Loading...' : 'Update'} onPress={() => updateProfile({ username, website, avatar_url: avatarUrl,full_name:fullname })} disabled={loading} />
      <CustomButton title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </ScrollView>
  )
}

function LabeledInput({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholder={label} {...props} />
    </View>
  )
}

function CustomButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  field: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  spacer: {
    height: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})