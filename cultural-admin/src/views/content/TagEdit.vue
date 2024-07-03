<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="标签名" prop="tagName">
          <el-input v-model="formData.tagName" :maxLength="10"></el-input>
        </el-form-item>
        <el-form-item label="标签颜色" prop="tagColor">
          <el-color-picker v-model="formData.tagColor"></el-color-picker>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveTag: "/content/saveTag",
};

const dialogConfig = ref({
  show: false,
  title: "新增标签",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  tagName: [{ required: true, message: "请输入标签名" }],
  tagColor: [{ required: true, message: "请选择风格颜色" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.tagId == null) {
      dialogConfig.value.title = "新增标签";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改标签";
      formData.value = Object.assign({}, data);
    }
  });
  formData.value.tagColor = data.tagColor; // 防止颜色选择器出现错误绑定
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.createTime;
    let result = await proxy.Request({
      url: api.saveTag,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
